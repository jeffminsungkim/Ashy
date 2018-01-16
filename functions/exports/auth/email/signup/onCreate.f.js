'use strict';

module.exports = ({ admin, functions, firestore }) => {
  return functions.auth.user().onCreate(event => {
    const user = event.data;
    const uid = user.uid;
    const email = user.email;
    const photoURL = user.photoURL ||
    'https://firebasestorage.googleapis.com/v0/b/ashy-dev-3662f.appspot.com/o/avatar-placeholder%2Favatar.png?alt=media&token=b914dee7-cdee-44ec-8222-146c9f6f3ef8';
    const appRef = firestore.doc(`app/${uid}`);
    const newUserRef = firestore.doc(`users/${uid}`);
    const batch = admin.firestore().batch();
    const userData = {
      uid: uid,
      email: email,
      photoURL: photoURL,
      lastLoginAt: null,
      statusMessage: null,
      currentActiveStatus: 'signout'
    };
    const appData = {
      emailVerified: false,
      firstLogin: false,
      signupAt: admin.firestore.FieldValue.serverTimestamp()
    };

    batch.set(newUserRef, userData);
    batch.set(appRef, appData);

    return batch.commit().then(() => console.log(`A new user signed up as ${email}`));
  });
};
