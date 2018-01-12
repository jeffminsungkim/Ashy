const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firestore = admin.firestore();

module.exports = functions.database
  .ref('/status/{uid}').onUpdate((event) => {
    // Get the data written to Realtime Database
    const eventStatus = event.data.val();

    const userStatusFirestoreRef = firestore.doc(`users/${event.params.uid}`);

    return event.data.ref.once("value").then((statusSnapshot) => {
      return statusSnapshot.val();
    }).then((status) => {
        console.log('eventStatus:', eventStatus);
        if (status.currentActiveStatus === 'offline' || status.currentActiveStatus === 'signout') return userStatusFirestoreRef.update(eventStatus);
    });
  });
