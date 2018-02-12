'use strict';

module.exports = ({ admin, functions, firestore }) => {
  return functions.auth.user().onCreate(event => {
    const BASE_URL = 'https://firebasestorage.googleapis.com/v0/b/ashy-development.appspot.com/o/default-profilephoto%2F';
    const user = event.data;
    const uid = user.uid;
    const email = user.email;
    const displayName = user.displayName || null;
    const photoURL = user.photoURL || null;
    const thumbnail = user.photoURL || `${BASE_URL}thumb_avatar.jpg?alt=media&token=e982270b-f905-4a72-9cb7-13973713953c`;
    const username = generateRandomUsername().toLowerCase();
    const appsRef = firestore.doc(`apps/${uid}`);
    const newUserRef = firestore.doc(`users/${uid}`);
    const usernameRef = firestore.doc(`usernames/${username}`);
    const batch = admin.firestore().batch();

    const initialState = {
      currentActiveStatus: 'signout',
      usingApp: false
    };

    const appData = {
      emailVerified: false,
      signupAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const userData = {
      uid: uid,
      email: email,
      displayName: displayName,
      photoURL: photoURL,
      thumbnailURL: thumbnail,
      username: username,
      gender: null,
      lastLoginAt: null,
      statusMessage: null,
      currentActiveStatus: 'signout'
    };

    batch.set(appsRef, appData);
    batch.set(newUserRef, userData);
    batch.set(usernameRef, {[username]: uid});

    return batch.commit().then(() => {
      console.log(`A new user signed up as ${email}`);
      return admin.database().ref(`status/${uid}`).set(initialState);
    });
  });
};

function generateRandomUsername() {
  return Math.random().toString(36).substr(2, 8);
}
