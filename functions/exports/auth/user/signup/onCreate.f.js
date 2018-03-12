'use strict';

module.exports = ({ admin, functions, firestore }) => {
  return functions.auth.user().onCreate(event => {
    const user = event.data;
    const uid = user.uid;
    const email = user.email;
    const displayName = user.displayName || null;
    const username = 'user' + getRandomInt(0, 999999);
    const appsRef = firestore.doc(`apps/${uid}`);
    const newUserRef = firestore.doc(`users/${uid}`);
    const usernameRef = firestore.doc(`usernames/${username}`);
    const batch = admin.firestore().batch();

    const initialState = {
      currentActiveStatus: 'signout',
      usingApp: false
    };

    const appData = {
      signupAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const userData = {
      uid: uid,
      email: email,
      displayName: displayName,
      photoURL: null,
      thumbnailURL: null,
      username: username,
      gender: null,
      lastLoginAt: null,
      statusMessage: null,
      signupAt: admin.firestore.FieldValue.serverTimestamp(),
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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
