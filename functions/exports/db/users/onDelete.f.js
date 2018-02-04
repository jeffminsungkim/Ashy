'use strict';

module.exports = ({ functions, firestore }) => {
  return functions.firestore.document('/users/{uid}').onDelete((event) => {
    const deletedUser = event.data.previous.data();
    console.log('deletedUser:', deletedUser);
    const email = deletedUser.email;
    const username = deletedUser.username;
    const usernameRef = firestore.doc(`usernames/${username}`);

    return usernameRef.delete().then(() => {
      console.log(`${email}: username, ${username} removed from Firestore.`);
    }).catch(err => console.log(err));
  });
};
