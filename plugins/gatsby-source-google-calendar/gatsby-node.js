const { google } = require('googleapis');
const moment = require('moment');

const defaultFieldsToInclude = ['start', 'end', 'summary', 'status', 'organizer'];

const processEvents = (event) => ({

});

const scopes = [
    `https://www.googleapis.com/auth/calendar.events.readonly`,
    `https://www.googleapis.com/auth/calendar.readonly`
];


exports.sourceNodes = async ({ actions }) => {
    const key = require(`../../pem/ccp_calendar_key.json`);
    const { createNode } = actions
    // setting the auth
    const token = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key,
        scopes,
        'info@ckendallart.com'
    );
    google.options({ auth: token });

    // getting the calendar client
    const calendar = google.calendar('v3');

    // getting the list of items for calendar
    const { data: { items }} = await calendar.events.list({
        calendarId: 'info@ckendallart.com',
        showDeleted: false,
        orderBy: 'starttime', // ascending
        singleEvents: true, // recurring events are duplicated
        timeMin: moment().format(), // only events after today
        timeMax: moment().add(2, 'y').format() // only events two years from now
     });

    items.forEach((item) => {
        if (item.hasOwnProperty('start')) {
            // console.log("keys", Object.keys(item));
            console.log(item.summary);
            console.log(item.sequence);
            console.log(item.status);
            console.log("start date", item.start.date);
            console.log("end date", item.end.date);
        }
    })
  
    // Process data into nodes.
    items.forEach(event => createNode(processEvents(event)))
  
    // We're done, return.
    return
};
