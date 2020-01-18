const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert(require('../../socialape-10903-firebase-adminsdk-788lh-1e4a60c036.json')),
    storageBucket: 'socialape-10903.appspot.com'
});

const db = admin.firestore();

module.exports = { admin, db };