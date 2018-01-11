const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const firestore = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
 console.log('Hello World Test Cloud Function Triggered!');
});

exports.onUserStatusChanged = functions.database
  .ref('/status/{uid}').onUpdate((event) => {
    // Get the data written to Realtime Database
    const eventStatus = event.data.val();

    const userStatusFirestoreRef = firestore.doc(`users/${event.params.uid}`);

    return event.data.ref.once("value").then((statusSnapshot) => {
      return statusSnapshot.val();
    }).then((status) => {
        console.log('eventStatus:', eventStatus);
        if (status.currentActiveStatus === 'offline') return userStatusFirestoreRef.update(eventStatus);
    });
  });
