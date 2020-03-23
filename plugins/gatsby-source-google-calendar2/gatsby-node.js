const { google } = require('googleapis');
const maps = require("@googlemaps/google-maps-services-js").Client;
const moment = require('moment');
const fs = require('fs');

const requiredFields = ['id', 'internal'];
const googleMapsClient = new maps({});
const defaultOptions = {
    includedFields: ['start', 'end', 'summary', 'status', 'organizer', 'description', 'location', 'slug'],
    calendarId: '',
    assumedUser: '',
    geoCodeApiKey: process.env.GOOGLE_MAPS_API_KEY,
    envVar: '',
    pemFilePath: '',
    // only events after today
    timeMin: moment().format(),
    // only events two years from now
    timeMax: moment().add(2, 'y').format(),
    scopes: [
        `https://www.googleapis.com/auth/calendar.events.readonly`,
        `https://www.googleapis.com/auth/calendar.readonly`
    ]
};
const forbiddenChars = [',', '!', '#', '?', '.'];
const fetchedLocations = []

const getLongAndLat = (key, event, slug) => {
    console.log("locations fetched", fetchedLocations);
    const eventLocationString = slug.split('/')[1];
    debugger;
    if (fetchedLocations.some((loc) => loc.address === eventLocationString)) {
        return Promise.resolve(fetchedLocations
            .find((loc) => loc.address === eventLocationString)
            .value);
    }
    return googleMapsClient
        .geocode({
            params: {
                address: event.location,
                key
            }
        })
        .then((data) => {
            const coordinates = data.data.results.find((result) => result.geometry.location);
            if (coordinates) {
                fetchedLocations.push({
                    address: eventLocationString,
                    value: coordinates.geometry.location
                });
                return coordinates.geometry.location;
            }
            else {
                fetchedLocations.push({
                    address: eventLocationString,
                    value: null
                });
                return null;
            }
        })
        .catch((e) => {
            console.log(`error fetching long and lat for ${event.location}: ${e}`);
            fetchedLocations.push({ address: eventLocationString, value: null });
            return null;
        });
};

const getSlug = (event) => {
    const summary = event.summary
        .split(" ")
        .map((word) => {
            return word
                .toLowerCase()
                .split('')
                .filter((char) => !forbiddenChars.includes(char))
                .join('')
        })
        .join("-");
    
    const date = event.start.date
        ? event.start.date
        : moment(event.start.dateTime).format('MM-DD-YYYY');
    
    return `${date}/${summary}`;
};

const processEvents = (event, fieldsToInclude) => {
    return Object.keys(event)
        .reduce((acc, key) => {
            if (fieldsToInclude.concat(requiredFields).includes(key)) {
                return {
                    ...acc,
                    [key]: event[key]
                };
            }
            return acc;
        }, {});
};

const getAuth = (options) => {
    if (options.envVar) return JSON.parse(options.envVar);
    if (fs.existsSync(options.pemFilePath)) {
        return require(options.pemFilePath);
    }
}

exports.sourceNodes = async ({ actions }, options = defaultOptions) => {
    const key = getAuth(options);
    const { createNode } = actions
    const {
        assumedUser,
        calendarId,
        includedFields,
        timeMax,
        timeMin,
        geoCodeApiKey,
        scopes } = { ...defaultOptions, ...options };
    
    // setting the general auth property for client
    const token = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key,
        scopes,
        assumedUser
    );
    google.options({ auth: token });

    // getting the calendar client
    const calendar = google.calendar('v3');

    // getting the list of items for calendar
    const { data: { items }} = await calendar.events.list({
        calendarId: calendarId,
        showDeleted: false,
        // ascending
        orderBy: 'starttime',
        // recurring events are duplicated
        singleEvents: true,
        timeMin: timeMin,
        timeMax: timeMax
     });
  
    // Process data into nodes.
    items
        .map(async (event, i) => {
            const eventSlug = getSlug(event);
            if (event.location) {
                return getLongAndLat(geoCodeApiKey, event, eventSlug)
                    .then((longAndLat) => {
                        console.log("long and lat", longAndLat);
                        return {
                            ...event,
                            slug: eventSlug,
                            geoCoordinates: longAndLat,
                            internal: {
                                contentDigest: event.updated,
                                type: 'GoogleCalendarEvent'
                            }
                        };
                    })
            }
            return {
                ...event,
                slug: eventSlug,
                geoCoordinates: null,
                internal: {
                    contentDigest: event.updated,
                    type: 'GoogleCalendarEvent'
                }
            };
        })
        .forEach(event => createNode(processEvents(event, includedFields)))
  
    // We're done, return.
    return
};
