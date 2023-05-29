const admin = require('firebase-admin');


const privateKey = process.env.PRIVATE_KEY.replace(/\\n/gm, '\n');

const options = {
  projectId: process.env.PROJECT_ID,
  clientEmail: process.env.CLIENT_EMAIL,
  privateKey,
};

admin.initializeApp({
  credential: admin.credential.cert(options),
  databaseURL: `https://${options.projectId}.firebaseio.com`,
});

const db = admin.database();

module.exports = { db };
