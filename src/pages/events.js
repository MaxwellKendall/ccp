import React from "react";
import moment from "moment";
import Layout from "../components/layout";
import { graphql, Link } from "gatsby";

export default ({ data }) => {
    return (
        <Layout>
            {data.allGoogleCalendarEvent.edges.map((edge) => {
                const event = edge.node;
                return (
                    <Link to={`events/${event.slug}`}>
                        <h1>Event Title: {event.summary}</h1>
                        <h2>Event Time: {`${moment(event.start.dateTime).format('LLLL')} - ${moment(event.end.dateTime).format('LT')} (approx.)`}</h2>
                    </Link>
                );
            })}
            </Layout>
    );
};

export const query = graphql`
  query {
    allGoogleCalendarEvent(sort: {fields: start___dateTime, order: ASC}) {
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
