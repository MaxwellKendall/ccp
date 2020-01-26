import React, { useState } from "react"
import moment from "moment"
import { graphql, navigate } from "gatsby"
import Loadable from 'react-loadable'

import Layout from "../components/layout"

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

const loading = () => <p>Loading...</p>;

const Calendar = Loadable({
  loader: () => import("../components/calendar"),
  loading
})

export default ({ data }) => {
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
  
  return (
    <Layout>
      <Calendar
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        events={events} />

      {/* {data.allGoogleCalendarEvent.edges.map(edge => {
        const event = edge.node
        return (
          <Link to={`events/${event.slug}`}>
            <h1>Event Title: {event.summary}</h1>
            <h2>
              Event Time:{" "}
              {`${moment(event.start.dateTime).format("LLLL")} - ${moment(
                event.end.dateTime
              ).format("LT")} (approx.)`}
            </h2>
          </Link>
        )
      })} */}
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
