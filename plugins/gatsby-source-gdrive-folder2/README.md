## Gatsby Source Gdrive
This plugin takes the following params and uses them (a) to copy assets from google drive to your local file system 
and (b) expose their meta-data properties from google drive under the `gDrive` namespace in graphql.

- Key: Authorizes service account to access google drive 
- Folder ID: Looks in this folder for files
- Destination: Downloads files from folder in drive and puts them in your local file tree at this destination

Here's an example from my `gatsby-config.js`:

```javascript
    {
      resolve: 'gatsby-source-gdrive',
      options: {
        folderId: GOOGLE_DRIVE_FOLDER_ID,
        key: GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY,
        destination: path.join(__dirname, 'src/drive')
      }
    },
```

## Limitations
Does not export google documents. I'm only using this for images!

## Acknowledgment
Based this off one of the existing google-drive source plugins. Sorry I can't remember which one, I tried a few and ran into some issues and this plugin was created in attempt to fix them. If for some reason whoever you are you find this and are upset, I'll gladly attribute you here in some fashion. Thanks!