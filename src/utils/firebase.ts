import admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';

if (!process.env.FIREBASE_PRIVATE_KEY) {
  throw new Error('[firebase] FIREBASE_PRIVATE_KEY not found');
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  storageBucket: `${process.env.FIREBASE_PROJECT_ID}.firebasestorage.app`,
});

const bucket = getStorage().bucket();

export { admin, bucket };
