import React from "react"
import moment from "moment"
import Layout from "../components/layout"
import { graphql } from "gatsby"

export default ({ data }) => {
  const event = data.allGoogleCalendarEvent.edges[0].node
  return (
    <Layout>
      <div className="md:py-4">
        <h1>Event Title: {event.summary}</h1>
        <h2>
          Event Time:{" "}
          {`${moment(event.start.dateTime).format("LLLL")} - ${moment(
            event.end.dateTime
          ).format("LT")} (approx.)`}
        </h2>
        <p>Event Location: {event.location} </p>
        <p>Event Status: {event.status} </p>
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
