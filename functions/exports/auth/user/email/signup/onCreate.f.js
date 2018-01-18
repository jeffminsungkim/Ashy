'use strict';

module.exports = ({ admin, functions, firestore }) => {
  return functions.auth.user().onCreate(event => {
    const user = event.data;
    const uid = user.uid;
    const email = user.email;
    const displayName = user.displayName || null;
    const photoURL = user.photoURL ||
    'https://firebasestorage.googleapis.com/v0/b/ashy-dev-3662f.appspot.com/o/avatar-placeholder%2Favatar.png?alt=media&token=b914dee7-cdee-44ec-8222-146c9f6f3ef8';
    const username = generateRandomUsername().toLowerCase();
    const appRef = firestore.doc(`app/${uid}`);
    const newUserRef = firestore.doc(`users/${uid}`);
    const usernameRef = firestore.doc(`usernames/${username}`);
    const batch = admin.firestore().batch();

    const appData = {
      emailVerified: false,
      firstLogin: false,
      signupAt: admin.firestore.FieldValue.serverTimestamp()
    };
    const userData = {
      uid: uid,
      email: email,
      displayName: displayName,
      photoURL: photoURL,
      username: username,
      lastLoginAt: null,
      statusMessage: null,
      currentActiveStatus: 'signout'
    };

    batch.set(appRef, appData);
    batch.set(newUserRef, userData);
    batch.set(usernameRef, {[username]: uid});

    return batch.commit().then(() => console.log(`A new user signed up as ${email}`));
  });
};

function generateRandomUsername() {
  return Math.random().toString(36).substr(2, 8);
}
