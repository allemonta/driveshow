const { google } = require('googleapis');

const googleConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirect: 'postmessage'
}

const createConnection = () => {
    return new google.auth.OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirect
    )
}

const getTokensByCode = async (code) => {
    const auth = createConnection();
    const result = await auth.getToken(code);
    return result.tokens
}

const getGoogleOauth2 = (auth) => {
    return google.oauth2({
        auth: auth,
        version: 'v2'
    });
}

const getDrive = (tokens) => {
    const auth = createConnection();
    auth.setCredentials(tokens);
    const drive = google.drive({ version: 'v3', auth });

    return drive
}

const getProfileInfo = async (tokens) => {
    const auth = createConnection()
    auth.setCredentials(tokens)
    const profile = (await getGoogleOauth2(auth).userinfo.get()).data

    return {
        googleId: profile.sub,
        name: profile.name,
        name: profile.given_name,
        surname: profile.family_name,
        email: profile.email,
        profilePicture: profile.picture,
    }
}

const getFolders = async (tokens) => {
    const drive = getDrive(tokens)
    const driveshowId = await getDriveshowFolder(drive)

    if (!Boolean(driveshowId))
        return []

    const result = await drive.files.list({
        q: `trashed=false and mimeType='application/vnd.google-apps.folder' and '${driveshowId}' in parents`,
        fields: 'nextPageToken, files(id, name, starred, webViewLink, parents)',
        spaces: 'drive'
    })

    return result.data.files
}

const getImages = async (tokens, folderId) => {
    const drive = getDrive(tokens)
    
    const result = await drive.files.list({
        q: `trashed=false and mimeType contains 'image/' and '${folderId}' in parents`,
        fields: 'nextPageToken, files(*)',
        spaces: 'drive'
    })

    return result.data.files
}

const getDriveshowFolder = async (drive) => {
    const result = await drive.files.list({
        q: `trashed=false and mimeType='application/vnd.google-apps.folder' and name='Driveshow'`,
        fields: 'files(id)',
        spaces: 'drive'
    })

    return result.data.files.length > 0 ? result.data.files[0].id : null
}

const createDriveshowFolder = async (tokens) => {
    const drive = getDrive(tokens)

    if (!Boolean(await getDriveshowFolder(drive))) {
        await drive.files.create({
            resource: {
                name: 'Driveshow',
                mimeType: 'application/vnd.google-apps.folder'
            },
            fields: 'id'
        })
    }
}

module.exports = {
    createConnection,
    getTokensByCode,
    getProfileInfo,
    getFolders,
    createDriveshowFolder,
    getImages
}