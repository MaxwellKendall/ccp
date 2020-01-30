const { google } = require('googleapis');
const path = require(`path`);
const mkdirp = require(`mkdirp`);
const fs = require(`fs`);
const lodash = require('lodash')

const log = str => console.log(`\n🚗 `, str);
const FOLDER = `application/vnd.google-apps.folder`;
const GOOGLE_DOC = 'application/vnd.google-apps.document';
const exportMime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

const getFolder = async (gDriveClient, folderId) => {
    const { data: { files }} = await gDriveClient.files.list({ q: `'${folderId}' in parents`});
    return files;
};

const getAuthorziedGdriveClient = (options) => {
  let key;
  const { scopes } = options;

  if (options.key) key = JSON.parse(options.key);
  if (fs.existsSync(options.pemFilePath)) {
      key = require(options.pemFilePath);
  }
    // setting the general auth property for client
    const token = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      scopes
  );
  google.options({ auth: token });

  return google.drive('v3');
};

exports.onPreBootstrap = (
  { graphql, actions },
  options
) => {
  return new Promise(async (resolve) => {
    log(`Started downloading content...`);

    // Get token and fetch root folder.
    const { folderId, destination } = options;

    // getting the drive client
    const gDriveClient = getAuthorziedGdriveClient(options);
    const filesInFolder = await getFolder(gDriveClient, folderId);

    // Create content directory if it doesn't exist.
    mkdirp(destination);

    // Start downloading recursively through all folders.
    console.time(`Downloading content ⏲`);

    Promise.all(fetchFilesInFolder(filesInFolder, undefined, gDriveClient, destination))
      .then(() => {
        resolve();
        log(`Downloaded all files from Google Drive! 🍻`);
        console.timeEnd(`Downloading content ⏲`);
      });
  });
};

function fetchFilesInFolder(filesInFolder, parent = '', gDriveClient, destination) {
    const promises = [];

    filesInFolder.forEach(async (file) => {
      if (file.mimeType === FOLDER) {
        // If it`s a folder, create it in filesystem
        const snakeCasedFolderName = file.name.toLowerCase().split(' ').join('_');
        log(`Creating folder ${parent}/${snakeCasedFolderName}`);
        mkdirp(path.join(destination, parent, snakeCasedFolderName));
        console.log("file has children", file);
        // Then, get the files inside and run the function again.
        const nestedFiles = getFolder(gDriveClient, file.id)
          .then((files) => {
            // combining array of promises into one.
            return Promise.all(fetchFilesInFolder(files, `${parent}/${snakeCasedFolderName}`, gDriveClient, destination));
          });
        promises.push(nestedFiles);
      }
      else if (file.mimeType === GOOGLE_DOC) {
        console.log("mime", file.id, file.mimeType)
        promises.push(
          new Promise(async (resolve, reject) => {
            // If it`s a file, download it and convert to buffer.
            const filePath = path.join(destination, parent, getFilenameByMime(file));
            const driveResponse = await gDriveClient.files.export({ fileId: file.id, mimeType: 'text/html' })
            const buff = new Buffer.from(driveResponse.data);
            fs.writeFile(filePath, buff, () => {
                log(`${file.name} written`);
                return resolve(getFilenameByMime(file));
            });
        }));
      }
      else {
        promises.push(
          new Promise(async (resolve, reject) => {
            // If it`s a file, download it and convert to buffer.
            const filePath = path.join(destination, parent, getFilenameByMime(file));
            const driveResponse = await gDriveClient.files.get({ fileId: file.id, alt: 'media', fields: "*" }, { responseType: 'arraybuffer' });
            const buff = new Buffer.from(driveResponse.data);
            fs.writeFile(filePath, buff, () => {
                log(`${file.name} written`);
                return resolve(getFilenameByMime(file));
            });
        }));
      }
    });

    return promises;
}

const fileExtensionsByMime = new Map([
  ['application/vnd.google-apps.document', '.html'],
  ['application/zip', '.zip'],
  ['text/plain', '.txt'],
  ['application/rtf', '.rtf'],
  ['application/vnd.oasis.opendocument.text', '.odt'],
  ['application/pdf', '.pdf'],
  ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.docx'],
  ['application/epub+zip', '.epub']
]);

const getFilenameByMime = file => {
  if (file.mimeType === GOOGLE_DOC) {
    return `${file.name}${fileExtensionsByMime.get(file.mimeType)}`
  } else {
    return file.name;
  }
}
