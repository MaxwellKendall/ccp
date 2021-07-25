import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExternalLinkAlt, faExternalLinkSquareAlt, faMapMarker } from "@fortawesome/free-solid-svg-icons"

import moment from "moment"
import { graphql, Link } from "gatsby"
import GoogleMapReact from 'google-map-react';

import Layout from "../components/layout"

const { GATSBY_GOOGLE_MAPS_KEY } = process.env;

const MapMarker = ({ lat, lng }) => {
  return (
    <a className="w-full flex flex-col cursor-pointer" target="_blank" href={`http://www.google.com/maps/place/${lat},${lng}`}>
      <FontAwesomeIcon icon={faMapMarker} size="lg" color="red" />
    </a>
  );
}

export default ({ data }) => {
  const event = data.allGoogleCalendarEvent.edges[0].node
  const {lat, lng } = event.geoCoordinates;
  const googleLink = `http://www.google.com/maps/place/${lat},${lng}`;

  return (
    <Layout classNames="mx-auto flex flex-col py-10 px-5 h-full">
      <div className="md:py-4 min-w-full h-5/6">
        <h1>{event.summary}</h1>
        <h2>
          {`${moment(event.start.dateTime).format("LLLL")} - ${moment(
            event.end.dateTime
          ).format("LT")} (approx.)`}
        </h2>
        <a href={googleLink} target="_blank" className="text-center">
          at {event.location}
          <FontAwesomeIcon className="ml-2" size="sm" icon={faExternalLinkSquareAlt} />
        </a>
        {event.attachments &&
          event.attachments.map(attachment => (
            <a href={attachment.fileUrl}>{`Possibly a Bulletin: ${attachment.title}`}</a>
          ))}
        <GoogleMapReact
          bootstrapURLKeys={{ key: GATSBY_GOOGLE_MAPS_KEY }}
          defaultCenter={{ lat, lng }}
          defaultZoom={15}>
            <MapMarker lat={lat} lng={lng} />
        </GoogleMapReact>
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
          geoCoordinates {
            lng
            lat
          }
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
