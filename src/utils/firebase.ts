import admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import ENV from './env.util';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: ENV.FIREBASE_PROJECT_ID,
    privateKey: ENV.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: ENV.FIREBASE_CLIENT_EMAIL,
  }),
  storageBucket: `${ENV.FIREBASE_PROJECT_ID}.firebasestorage.app`,
});

const bucket = getStorage().bucket();

export { admin, bucket };
