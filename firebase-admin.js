const admin = require('firebase-admin');

const serviceAccount = require('./safeguide-5408e-firebase-adminsdk-u1shc-d534b4b04a.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db;
