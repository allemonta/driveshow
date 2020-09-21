const { google } = require('googleapis');
const axios = require('axios');
const path = require('path')
const fs = require('fs')

const googleConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirect: process.env.GOOGLE_REDIRECT_URL,
};

const defaultScope = [
    'profile',
    'email',
    'openid',
    'https://www.googleapis.com/auth/drive'
];

const createConnection = () => {
    return new google.auth.OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirect
    );
}

const getAuthenticationUrl = () => {
    const auth = createConnection();
    const url = auth.generateAuthUrl({
        access_type: 'offline',
        scope: defaultScope
    })

    return url;
}

const getTokensByCode = async (code) => {
    const auth = createConnection();
    const { tokens } = await auth.getToken(code);
    return tokens
}

const verifyToken = (token) => {
    return axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`)
}

const getGoogleOauth2 = (auth) => {
    return google.oauth2({
        auth: auth,
        version: 'v2'
    });
}

const getProfile = (tokens) => {
    const auth = createConnection();
    auth.setCredentials(tokens);
    return getGoogleOauth2(auth).userinfo.get()
}

const createRootFolder = (tokens) => {
    const auth = createConnection();
    auth.setCredentials(tokens);
    const drive = google.drive({ version: 'v3', auth });

    var fileMetadata = {
        'name': 'DriveShow',
        'mimeType': 'application/vnd.google-apps.folder'
    };

    return drive.files.create({
        resource: fileMetadata,
        fields: 'id'
    })
}

const getFolders = (tokens, folderId) => {
    const auth = createConnection();
    auth.setCredentials(tokens);
    const drive = google.drive({ version: 'v3', auth });

    return drive.files.list({
        //resource: { parents: [ folderId ] },
        q: `trashed=false and '${folderId}' in parents and mimeType='application/vnd.google-apps.folder'`,
        fields: 'nextPageToken, files(id, name, starred, webViewLink)',
    })
}

const getImages = (tokens, folderId) => {
    const auth = createConnection();
    auth.setCredentials(tokens);
    const drive = google.drive({ version: 'v3', auth });

    return drive.files.list({
        q: `trashed=false and '${folderId}' in parents and mimeType contains 'image/'`,
        //fields: 'nextPageToken, files(id, name, starred, webViewLink)',
        fields: 'nextPageToken, files(*)',
    })
}

module.exports = {
    createConnection,
    getAuthenticationUrl,
    getTokensByCode,
    verifyToken,
    getGoogleOauth2,
    getProfile,
    createRootFolder,
    getFolders,
    getImages
}
