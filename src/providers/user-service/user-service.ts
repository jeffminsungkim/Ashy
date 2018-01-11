// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { User } from '@ashy-models/user';

import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';


@Injectable()
export class UserServiceProvider {

  private rtdb: any;
  private usersRef: AngularFirestoreCollection<User>;
  private friendsRef: AngularFirestoreCollection<User>;
  authState: any = null;
  // usersRef: AngularFirestoreCollection<any>;
  users$: Observable<User[]>;
  defaultProfileImgURL: string;
  user$: any;
  friendsListRef$: AngularFirestoreCollection<any>;
  friends$: Observable<any[]>;

  constructor(
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore) {

      this.rtdb = firebase.database();
      this.usersRef = this.afs.collection<User>('users');
      this.afAuth.authState.do(user => {
        this.authState = user;
        if (user) {
          this.updateOnConnect();
          this.updateOnDisconnect();
        }
      }).subscribe();
      this.defaultProfileImgURL = 'https://firebasestorage.googleapis.com/v0/b/ashy-dev-3662f.appspot.com/o/avatar-placeholder%2Favatar.png?alt=media&token=b914dee7-cdee-44ec-8222-146c9f6f3ef8';
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
    // return this.authState.uid;
  }

  get currentUserDisplayName(): string {
    return this.authState['displayName'];
  }

  get currentUserEmailVerified(): boolean {
    return this.authState['emailVerified'];
  }

  get currentUserEmail(): string {
    return this.authState['email'];
  }

  get currentUserPhotoURL(): string {
    return this.authState['photoURL'];
  }

  // determineUserSentFriendRequestToCertainParty(followingUserUID: string) {
  //   let usersRef = this.afDB.list('friend-requests/', ref => ref.orderByChild(followingUserUID));
  //   this.users$ = usersRef.snapshotChanges().map(changes => {
  //     return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
  //   });
  //   return this.users$;
  // }

  /*determineUserSentFriendRequestToCertainParty(followingUserUID: string) {
    return this.afDB.list(`friend-requests/${followingUserUID}`, ref => ref.orderByChild('uid').equalTo(this.currentUserId)).valueChanges();
  }

  getCurrentUserProfilePhoto() {
    return this.afDB.object(`profilepics/${this.currentUserId}`).valueChanges();
  }

  getCurrentUserObject() {
    return this.afDB.object(`users/${this.currentUserId}`).valueChanges();
  }*/

  private getCurrentUserRef(uid: string) {
    return this.usersRef.doc<User>(uid);
  }

  private getCurrentUserFriendRef(uid: string) {
    return this.usersRef.doc<User>(uid).collection('friends');
  }

  getCurrentUser() {
    return this.getCurrentUserRef(this.currentUserId).valueChanges();
  }

  /*getCurrentUsername() {
    return this.afDB.object(`users/${this.currentUserId}/username`).valueChanges();
  }

  getUserActiveStatus(): Observable<any> {
    return this.afDB.object(`users/${this.currentUserId}/currentActiveStatus`).valueChanges();
  }*/

  getMyFriendsId() {
    let friendRef = this.getCurrentUserFriendRef(this.currentUserId);
    this.friends$ = friendRef.snapshotChanges().map(actions => {
      return actions.map(a => ({ key: a.payload.doc.id, ...a.payload.doc.data()}));
    });
    return this.friends$;
  }

  getFriends(uid: string) {
    return this.getCurrentUserRef(uid).valueChanges();
  }

  /*deleteLoggedInUser() {
    let endpoint = this.usersNode + this.currentUserId;
    return this.afDB.object(endpoint).remove();
  }

  updatePhotoUrlToPlaceholder() {
     let endpoint = this.usersNode + this.currentUserId;
     let photoURL = { photoURL: this.defaultProfileImgURL }
     return this.afDB.object(endpoint).update(photoURL).catch(error => console.error("Update photoURL", error));
  }

  updatePhotoUrlFromPlaceholder(url: string) {
    let endpoint = this.usersNode + this.currentUserId;
    let photoURL = { photoURL: url }
    return this.afDB.object(endpoint).update(photoURL).catch(error => console.error("Update photoURL", error));
  }*/

  updateEmailVerificationStatus() {
    if (this.currentUserEmailVerified) return;
    let emailVerified = { emailVerified: this.currentUserEmailVerified }
    this.usersRef.doc(this.currentUserId).update(emailVerified).catch(error => console.error('Update User',error));
    console.log("Updated email verification status");

  }

  updateLastLoginTime() {
    let lastLogin = { lastLoginAt: firebase.firestore.FieldValue.serverTimestamp() };
    this.usersRef.doc(this.currentUserId).update(lastLogin);
  }

  updateCurrentUserActiveStatusTo(status: string) {
    let activeStatus = { currentActiveStatus: status }
    this.rtdb.ref(`status/${this.currentUserId}`).update(activeStatus);
    this.usersRef.doc(this.currentUserId).update(activeStatus).catch(error => console.error('Update CurrentActiveStatus in users node Fails',error));
  }

  // updateFriendActiveStatusTo(status: string) {
  //   let activeStatus = { currentActiveStatus: status }
  //   console.log("stats1:", status);
  //   this.afDB.list(`friends/${this.currentUserId}`).snapshotChanges().subscribe(snapshot => {
  //     console.log('snapshot', snapshot);
  //     let updateObj = {};
  //     snapshot.forEach(friend => {
  //       console.log("stats2:", status);
  //       updateObj[`friends/${friend.key}/${this.currentUserId}`] = activeStatus;
  //     });
  //     firebase.database().ref().update(updateObj);
  //   });
  // }

  // Updates status when connection to Firebase starts
  updateOnConnect() {
    if (!this.currentUserEmailVerified) return;
    return this.rtdb.ref('.info/connected').on('value', snapshot => {
      this.updateCurrentUserActiveStatusTo('online');
      this.updateLastLoginTime();
    });
  }

  // Updates status when connection to Firebase ends
  updateOnDisconnect() {
    if (!this.currentUserEmailVerified) return;
    const currentActiveStatus = this.rtdb.ref('.info/connected');
    currentActiveStatus.on('value', snapshot => {
      this.rtdb.ref(`status/${this.currentUserId}`)
      .onDisconnect()
      .update({ currentActiveStatus: 'offline' });
    });
  }

  /*updateGender(selectedGender: string) {
    let gender = { gender: selectedGender }
    console.log('selected gender', selectedGender);
    this.afDB.object(`users/${this.currentUserId}`).update(gender).catch(error => console.error('Update Gender Fails', error));
  }

  checkUsername(username: string) {
    username = username.toLowerCase();
    return this.afDB.object(`usernames/${username}`).valueChanges();
  }

  // updateUsername(username: string) {
  //   let data = {};
  //   data[username] = this.currentUserId;
  //   this.afDB.object(`users/${this.currentUserId}`).update({'username': username});
  //   this.afDB.object(`usernames`).update(data);
  // }
  updateUsername(username: string) {
    let updateUsername = {};
    updateUsername[`usernames/${username}`] = this.currentUserId;
    updateUsername[`users/${this.currentUserId}/username`] = username;
    firebase.database().ref().update(updateUsername);
  }

  removeDeprecatedUsername(username: string) {
    this.afDB.object(`usernames/${username}`).remove();
  }

  getMatchedUser(UID: string) {
    return this.afDB.object(`users/${UID}`).valueChanges();
  }

  sendFriendRequest(recipient: string, sender: User) {
    let senderInfo = {
      uid: sender.uid,
      displayName: sender.displayName,
      photoURL: sender.photoURL,
      username: sender.username,
      timestamp: Date.now(),
      message: 'wants to be friend with you.'
    }
    return new Promise((resolve, reject) => {
      this.afDB.list(`friend-requests/${recipient}`).push(senderInfo).then(() => {
        resolve({'status': true, 'message': 'Friend request has sent.'});
      }, error => reject({'status': false, 'message': error}));
    });
  }

  fetchFriendRequest() {
    return this.afDB.list(`friend-requests/${this.currentUserId}`).valueChanges();
  }

  acceptFriendRequest(sender: User, user: User) {
    // let acceptedUserInfo = {
    //   uid: sender.uid,
    //   displayName: sender.displayName,
    //   photoURL: sender.photoURL,
    //   statusMessage: sender.statusMessage,
    //   username: sender.username,
    //   currentActiveStatus: sender.currentActiveStatus
    // }

    // let accepterInfo = {
    //   uid: user.uid,
    //   displayName: user.displayName,
    //   photoURL: user.photoURL,
    //   statusMessage: user.statusMessage,
    //   username: user.username,
    //   currentActiveStatus: user.currentActiveStatus
    // }

    this.afDB.list(`friends/${this.currentUserId}`).set(sender.uid, true);
    this.afDB.list(`friends/${sender.uid}`).set(user.uid, true);
    // this.afDB.list(`friends/${this.currentUserId}`).set(sender.uid, acceptedUserInfo);
    // this.afDB.list(`friends/${sender.uid}`).set(user.uid, accepterInfo);
    this.removeCompletedFriendRequest(sender.uid);
  }

  rejectFriendRequest(UID: string) {
    this.removeCompletedFriendRequest(UID);
  }

  removeCompletedFriendRequest(UID: string) {
    const endpoint = `friend-requests/${this.currentUserId}`;
    this.afDB.list(endpoint, ref => ref.orderByChild('uid').equalTo(UID)).snapshotChanges().take(1).subscribe((snapshot) => {
      snapshot.map(requester => {
        console.log('key', requester.key);
        this.afDB.list(endpoint).remove(requester.key);
      });
    });
  }*/

  removeUserFromFriendList(uid: string) {
    this.getCurrentUserFriendRef(this.currentUserId).doc(uid).delete();
  }

}
