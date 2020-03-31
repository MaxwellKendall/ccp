import React, { useEffect } from "react"
import moment from "moment"
import Layout from "../components/layout"
import { graphql } from "gatsby"

export default ({ data }) => {
  const event = data.allGoogleCalendarEvent.edges[0].node
  
  useEffect(() => {
    const event = data.allGoogleCalendarEvent.edges[0].node
    const { slug } = event
    // const { lat, lng } = event.geoCoordinates
    // const myLatlng = new window.google.maps.LatLng(lat, lng);

    // new window.google.maps.Map(document.getElementById(slug), {
    //   center: myLatlng,
    //   zoom: 8
    // })
  }, [])

  return (
    <Layout>
      <div className="md:py-4">
        <h1>{event.summary}</h1>
        <h2>
          {`${moment(event.start.dateTime).format("LLLL")} - ${moment(
            event.end.dateTime
          ).format("LT")} (approx.)`}
        </h2>
        <p>{event.location} </p>
        <div className="map" id={event.slug} />
        <p>Status: {event.status} </p>
        {event.attachments &&
          event.attachments.map(attachment => (
            <a
              href={attachment.fileUrl}
            >{`Possibly a Bulletin: ${attachment.title}`}</a>
          ))}
      </div>
    </Layout>
  )
}
export const query = graphql`
  query($id: String!) {
    allGoogleCalendarEvent(filter: { id: { eq: $id } }) {
      edges {
        node {
          summary
          start {
            dateTime
          }
          end {
            dateTime
          }
          description
          location
          slug
          status
          attachments {
            fileUrl
            title
          }
        }
      }
    }
  }
`
