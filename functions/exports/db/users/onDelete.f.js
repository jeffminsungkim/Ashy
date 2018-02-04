'use strict';

module.exports = ({ functions, firestore }) => {
  return functions.firestore.document('/users/{uid}').onDelete((event) => {
    const deletedUser = event.data.previous.data();
    const email = deletedUser.email;
    const uid = deletedUser.uid;
    const username = deletedUser.username;
    const userFriendsRef = getFriendsRef(firestore, uid);
    const usernameRef = getUsernamesRef(firestore, username);

    userFriendsRef.get().then(snapshot => {
      if (snapshot.docs.length === 0) {
        console.log(`Account ${email} has no friend list.`);
        return;
      } else {
        snapshot.forEach(doc => {
          removeDummyIdInFriendsColl(firestore, uid, doc.id);
        });
      }
    }).catch(err => console.log('Error getting friends documents', err));

    return usernameRef.delete().then(() => {
      console.log(`${email}: username, ${username} removed from Firestore.`);
    }).catch(err => console.log(err));
  });
};

// Removing all user IDs that no longer exist in the Friends collection.
function removeDummyIdInFriendsColl(firestore, dummyId, associatedId) {
  const friendsRef = getFriendsRef(firestore, associatedId);
  const deletedUserFriendsRef = getFriendsRef(firestore, dummyId);

  return friendsRef.doc(dummyId).delete().then(() => {
    console.log("Successfully removed", dummyId, "from", associatedId,"'s friend list.");
    return deletedUserFriendsRef.doc(associatedId).delete().then(() => {
      // When deleted user's id has removed from N user's friend list, then remove doc from deleted user's friend list.
      console.log("Successfully removed", associatedId, "from", dummyId,"'s friend list.");
    });
  }).catch(err => console.log('Error removing friends documents', err));
}

function getFriendsRef(firestore, uid) {
  return firestore.doc(`users/${uid}`).collection('friends');
}

function getUsernamesRef(firestore, username) {
  return firestore.doc(`usernames/${username}`);
}
