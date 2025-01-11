import fbAdmin from 'firebase-admin';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('../serviceAccountKey.json');

fbAdmin.initializeApp({
    credential: fbAdmin.credential.cert(serviceAccount),
    // databaseURL: process.env.DATABASE_URL, // for realtime database
});

const db = fbAdmin.firestore();
const auth = fbAdmin.auth();

export { db, auth, fbAdmin };