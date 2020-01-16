const { google } = require('googleapis');
const path = require(`path`);
const mkdirp = require(`mkdirp`);
const fs = require(`fs`);

const log = str => console.log(`\n🚗 `, str);
const FOLDER = `application/vnd.google-apps.folder`;
const GOOGLE_DOC = 'application/vnd.google-apps.document';

const defaultOptions = {
    folderId: '16donbs7-81ncyDK2G4XFI9b5Cf_I0GDD',
    key: '',
    scopes: [
      'https://www.googleapis.com/auth/drive',
    ]
};

const getAuth = (options) => {
    if (options.key) return JSON.parse(options.key);
    if (fs.existsSync(options.pemFilePath)) {
        return require(options.pemFilePath);
    }
}

const getFolder = async (driveClient, folderId) => {
    const { data: { files }} = await driveClient.files.list({ q: `'${folderId}' in parents`});
    return files;
};

exports.onPreBootstrap = (
  { graphql, actions },
  options
) => {
  return new Promise(async (resolve) => {
    log(`Started downloading content`);

    // Get token and fetch root folder.
    const key = getAuth(options);
    const { createNode } = actions;
    const { folderId, destination, scopes } = { ...options, ...defaultOptions };
    
    // setting the general auth property for client
    const token = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key,
        scopes
    );

    google.options({ auth: token });

    // getting the drive client
    const driveClient = google.drive('v3');
    const filesInFolder = await getFolder(driveClient, folderId);

    // Create content directory if it doesn't exist.
    mkdirp(destination);

    // Start downloading recursively through all folders.
    console.time(`Downloading content ⏲`);

    Promise.all(fetchFilesInFolder(filesInFolder, undefined, driveClient, destination))
      .then(() => {
        resolve();
        log(`Downloaded all files from Google Drive! 🍻`);
        console.timeEnd(`Downloading content ⏲`);
      });
  });
};

function fetchFilesInFolder(filesInFolder, parent = '', driveClient, destination) {
    const promises = [];

    filesInFolder.forEach(async (file) => {
      if (file.mimeType === FOLDER) {
        // If it`s a folder, create it in filesystem
        const snakeCasedFolderName = file.name.toLowerCase().split(' ').join('_');
        log(`Creating folder ${parent}/${snakeCasedFolderName}`);
        mkdirp(path.join(destination, parent, snakeCasedFolderName));

        // Then, get the files inside and run the function again.
        const nestedFiles = getFolder(driveClient, file.id)
          .then((files) => {
            // combining array of promises into one.
            return Promise.all(fetchFilesInFolder(files, `${parent}/${snakeCasedFolderName}`, driveClient, destination));
          });
        promises.push(nestedFiles);
      }
      else {
        promises.push(
          new Promise(async (resolve, reject) => {
            // If it`s a file, download it and convert to buffer.
            const filePath = path.join(destination, parent, getFilenameByMime(file));
            const { data } = await driveClient.files.get({ fileId: file.id, alt: 'media', fields: "*" }, { responseType: 'arraybuffer' });
            const buff = new Buffer.from(data);
            
            fs.writeFile(filePath, buff, () => {
              log(`${file.name} written`);
              resolve(getFilenameByMime(file));
            });
          })
        );
      }
    });

    return promises;
}

const fileExtensionsByMime = new Map([
  ['text/html', '.html'],
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
    return `${file.name}${fileExtensionsByMime.get(exportMime)}`
  } else {
    return file.name;
  }
}