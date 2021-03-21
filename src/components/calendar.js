// import React from 'react'
// import moment from 'moment'
// import FullCalendar from '@fullcalendar/react'
// import dayGridPlugin from '@fullcalendar/daygrid'
// import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick

// const getClassByEventSummary = (event) => {
//     if (moment(event.start.dateTime).weekday() === 0) {
//       return 'lords-day-event';
//     }
//     if (event.summary.toLowerCase().includes("study")) {
//       return 'bible-study-event';
//     }
//     return 'ccp-event';
//   };

// export default ({ events, eventClick, dateClick }) => {
//     return (
//         <FullCalendar
//             defaultView="dayGridWeek"
//             plugins={[dayGridPlugin, interactionPlugin]}
//             dateClick={dateClick}
//             weekends
//             eventClick={eventClick}
//             events={events} />
//     )
// }
