'use strict';

module.exports = ({ admin, functions, firestore }) => {
  return functions.auth.user().onCreate(event => {
    const user = event.data;
    const uid = user.uid;
    const email = user.email;
    const displayName = user.displayName || null;
    const photoURL = user.photoURL ||
    'https://firebasestorage.googleapis.com/v0/b/ashy-dev-3662f.appspot.com/o/avatar-placeholder%2Favatar.jpg?alt=media&token=210aa481-209b-4374-a494-13bdbdc17b54';
    const thumbnail = 'https://firebasestorage.googleapis.com/v0/b/ashy-dev-3662f.appspot.com/o/avatar-placeholder%2Fthumb_avatar.jpg?alt=media&token=0e1d9733-a87d-4bf7-be4a-072dd1c20c50';
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
      thumbnail: thumbnail,
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
