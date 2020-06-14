
import React, { useState, useEffect } from "react"
import moment from "moment"
import { graphql, navigate, Link } from "gatsby"
import Loadable from 'react-loadable'
import cx from 'classnames'

import Layout from "../components/layout"
import Card from "../components/card"
import SEO from "../components/seo"

const getClassByEventSummary = (event, selectedDate) => {
  if (moment(event.start.dateTime) === selectedDate) {
    return 'selected-date'
  }
  else if (moment(event.start.dateTime).weekday() === 0) {
    return 'lords-day-event';
  }
  if (event.summary.toLowerCase().includes("study")) {
    return 'bible-study-event';
  }
  return 'ccp-event';
};

export const getDate = (event) => `${moment(event.start.dateTime).format('dddd MMMM Do, YYYY')}`;
export const isLordsDay = (date) => date.includes('Sunday');

const loading = () => <p>Loading...</p>

const Calendar = Loadable({
  loader: () => import("../components/calendar"),
  loading
})

export const EventExcerpt = ({
  summary,
  slug,
  description,
  location,
  start,
  end,
  attachments
}) => {
  const startAndEndTime = `${moment(start.dateTime).format("hh:mm A")} - ${moment(
    end.dateTime
  ).format("hh:mm A")}`
  const duration = moment.duration(moment(end.dateTime).diff(moment(start.dateTime))).humanize()
  return (
    <div>
      <div className="py-4 flex items-center justify-start">
        <h3 className="m-0">{summary}</h3>
      </div>
      <p>{location}</p>
      <p>{`${startAndEndTime} (approximately ${duration})`}</p>
      <p>{description}</p>
      <div className="map" id={`${slug}`} />
      {attachments && (
        attachments.map((attachment) => {
          return <a href={attachment.fileUrl}>{attachment.title}</a>
        })
      )}
    </div>
  )
}

export default ({
  data
}) => {
  const [selectedDate, updateSelectedDate] = useState(moment().format('MM-DD-YYYY'))

  const handleEventClick = (args) => {
    navigate(`events/${args.event.extendedProps.slug}`)
  }

  const handleDateClick = (args) => {
    console.log(`Date was clicked ${args}`)
  }

  const events = data.allGoogleCalendarEvent.edges.map((edge) => ({
    title: edge.node.summary,
    start: moment(edge.node.start.dateTime).format(),
    end: moment(edge.node.end.dateTime).format(),
    className: getClassByEventSummary(edge.node, selectedDate),
    location: edge.node.location,
    attachments: edge.node.attachments
      ? edge.node.attachments[0].fileUrl
      : null,
    slug: edge.node.slug
  }))

  // useEffect(() => {
  //   data.allGoogleCalendarEvent.edges
  //     .filter((event) => event.node.geoCoordinates)
  //     .forEach((event) => {
  //       const { slug } = event.node
  //       const { lat, lng } = event.node.geoCoordinates
  //       const myLatlng = new window.google.maps.LatLng(lat, lng);

  //       new window.google.maps.Map(document.getElementById(slug), {
  //         center: myLatlng,
  //         zoom: 8
  //       })
  //     })
  // }, [])
  
  return (
    <Layout classNames="mx-auto flex flex-col py-10 px-5 my-2 min-h-full">
      {/* <Calendar
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        events={events} /> */}
      <SEO title="Christ Church Presbyterian Events" />
      {data.allGoogleCalendarEvent.edges.map(edge => {
        const date = getDate(edge.node);
        const isSabbath = isLordsDay(date);        
        return (
          <Card isSearchEnabled={false} slug={`events/${edge.node.slug}`} title={date} className={cx({ 'is-lords-day': isSabbath })}>
            <EventExcerpt {...edge.node} />
          </Card>
        )
      })}
    </Layout>
  )
}

export const query = graphql`
  query {
    allGoogleCalendarEvent(sort: { fields: start___dateTime, order: ASC }) {
      edges {
        node {
          summary
          slug
          start {
            dateTime
          }
          end {
            dateTime
          }
          description
          location
          status
          attachments {
            fileUrl
          }
        }
      }
    }
  }
`
