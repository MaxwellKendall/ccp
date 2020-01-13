const { google } = require('googleapis');
const fs = require('fs');

const defaultOptions = {
    assumedUser: 'info@ckendallart.com',
    folderId: '16donbs7-81ncyDK2G4XFI9b5Cf_I0GDD',
    envVar: '',
    scopes: [
        `https://www.googleapis.com/auth/drive.readonly`
    ]
};

const getAuth = (options) => {
    if (options.envVar) return JSON.parse(options.envVar);
    if (fs.existsSync(options.pemFilePath)) {
        return require(options.pemFilePath);
    }
}

exports.sourceNodes = async ({ actions }, options = defaultOptions) => {
    const key = getAuth(options);
    const { createNode } = actions;
    const { scopes, folderId, assumedUser } = { ...defaultOptions, ...options };
    
    // setting the general auth property for client
    const token = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key,
        scopes,
        assumedUser
    );

    google.options({ auth: token });

    // getting the drive client
    const drive = google.drive('v3');

    // getting the list of items from drive
    const { data: { files }} = await drive.files.list({
        q: `${folderId} in parents`
     });

    console.log("data", files);
    // Process data into nodes.
    // items
    //     .map(item => ({
    //         ...item,
    //         // internal: {
    //         //     contentDigest: event.updated,
    //         //     type: 'GoogleCalendarEvent'
    //         // }
    //     }))
    //     .forEach(item => console.log("item"));
        // .forEach(event => createNode(processEvents(event, includedFields)))
  
    // We're done, return.
    return
};
