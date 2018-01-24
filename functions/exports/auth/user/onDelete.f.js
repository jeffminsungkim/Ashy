'use strict';

module.exports = ({ admin, functions, firestore }) => {
  return functions.auth.user().onDelete(event => {
    const user = event.data;
    const uid = user.uid;
    const email = user.email;
    const appRef = firestore.doc(`app/${uid}`);
    const newUserRef = firestore.doc(`users/${uid}`);
    const batch = admin.firestore().batch();

    batch.delete(appRef);
    batch.delete(newUserRef);


    return batch.commit().then(() => {
      console.log(`User, ${email} deleted.`);
    }).then(() => {
      console.log(`RTDB user status deleted.`);
      return admin.database().ref(`status/${uid}`).remove();
    }).catch(err => console.log('Deletion Error:', err));
  });
};
