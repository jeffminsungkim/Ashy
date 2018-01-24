'use strict';

module.exports = ({ admin, functions, firestore }) => {
  return functions.auth.user().onCreate(event => {
    const BASE_URL = 'https://firebasestorage.googleapis.com/v0/b/ashy-dev-3662f.appspot.com/o/avatar-placeholder%2F';
    const user = event.data;
    const uid = user.uid;
    const email = user.email;
    const displayName = user.displayName || null;
    const photoURL = user.photoURL || `${BASE_URL}avatar.jpg?alt=media&token=210aa481-209b-4374-a494-13bdbdc17b54`;
    const thumbnail = `${BASE_URL}thumb_avatar.jpg?alt=media&token=0e1d9733-a87d-4bf7-be4a-072dd1c20c50`;
    const username = generateRandomUsername().toLowerCase();
    const appRef = firestore.doc(`app/${uid}`);
    const newUserRef = firestore.doc(`users/${uid}`);
    const usernameRef = firestore.doc(`usernames/${username}`);
    const batch = admin.firestore().batch();

    const rtdbUserStatus = {
      currentActiveStatus: 'firstlogin',
      usingApp: true
    };

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
      thumbnailURL: thumbnail,
      username: username,
      gender: null,
      lastLoginAt: null,
      statusMessage: null,
      currentActiveStatus: 'firstlogin'
    };

    batch.set(appRef, appData);
    batch.set(newUserRef, userData);
    batch.set(usernameRef, {[username]: uid});

    return batch.commit().then(() => {
      console.log(`A new user signed up as ${email}`);
      return admin.database().ref(`status/${uid}`).set(rtdbUserStatus);
    });
  });
};

function generateRandomUsername() {
  return Math.random().toString(36).substr(2, 8);
}
