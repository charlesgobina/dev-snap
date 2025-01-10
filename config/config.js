import fbAdmin from 'firebase-admin';
import serviceAccountKey from '../serviceAccountKey.js';

fbAdmin.initializeApp({
    credential: fbAdmin.credential.cert(serviceAccountKey),
    // databaseURL: process.env.DATABASE_URL, // for realtime database
});

const db = fbAdmin.firestore();
const auth = fbAdmin.auth();

export { db, auth };