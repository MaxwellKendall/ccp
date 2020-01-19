const { google } = require('googleapis');
const lodash = require('lodash')

const log = str => console.log(`\n🚗 `, str);
const FOLDER = `application/vnd.google-apps.folder`;

const getFolder = async (gDriveClient, folderId) => {
    const { data: { files }} = await gDriveClient.files.list({ q: `'${folderId}' in parents`});
    return files;
};

const getAuthorziedGdriveClient = (options) => {
  const key = JSON.parse(options.key);
    // setting the general auth property for client
  const token = new google.auth.JWT(
    key.client_email,
    null,
    key.private_key,
    options.scopes
  );
  google.options({ auth: token });

  return google.drive('v3');
};

function fetchFilesInFolder(filesInFolder, gDriveClient) {
    const promises = [];

    filesInFolder.forEach(async (file) => {
      if (file.mimeType === FOLDER) {
        // Then, get the files inside and run the function again.
        const nestedFiles = getFolder(gDriveClient, file.id)
          .then((files) => {
            // combining array of promises into one.
            return Promise.all(fetchFilesInFolder(files, gDriveClient));
          })
          .catch((e) => console.log("error: ", e));
        promises.push(nestedFiles);
      }
      else {
        promises.push(
          new Promise(async (resolve, reject) => {
            const { data } = await gDriveClient.files.get({ fileId: file.id, fields: "description, name, kind, modifiedTime, trashed, id" });
            resolve(data);
        }));
      }
    });

    return promises;
};

const toCamelCase = (property) => {
  if (property) {
    return property
      .split(" ")
      .map((word) => word.toLowerCase())
      .join("_")
  }

  return '';
}

exports.sourceNodes = async ({ actions }, options = { test: '456' }) => {
    log('creating graphql nodes...');
    const { createNode } = actions;
    const { folderId } = options;
    const gDriveClient = getAuthorziedGdriveClient(options);
    const filesInFolder = await getFolder(gDriveClient, folderId);

    return new Promise((resolve, reject) => {
      Promise.all(fetchFilesInFolder(filesInFolder, gDriveClient))
        .then((allFiles) => {
          lodash.flattenDeep(allFiles)
              .filter((file) => !file.trashed)
              .map((file) => ({
                  id: file.id,
                  description: toCamelCase(file.description),
                  name: toCamelCase(file.name),
                  internal: {
                      contentDigest: `${file.id}_${file.modifiedTime}`,
                      type: 'gDriveContent'
                  }
              }))
              .forEach((file) => createNode(file));
              resolve();
        })
        .catch(e => console.log(`Error: ${e}`));
    });
};
