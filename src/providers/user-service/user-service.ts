// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/switchMap';

import { AuthServiceProvider } from '../auth-service/auth-service';

import { User } from '../../models/user';

@Injectable()
export class UserServiceProvider {
  private usersRef: AngularFireList<any>;
  private users$: Observable<User[]>;
  private authState: any = null;
  private usersNode: string;
  private defaultProfileImgURL: string;
  private user$: any;
  private friendsListRef$: AngularFireList<any>;
  private friends$: Observable<any[]>;

  constructor(
    private afAuth: AngularFireAuth,
    private afDB: AngularFireDatabase,
    private authService: AuthServiceProvider) {


    this.usersNode = 'users/';
    this.afAuth.authState.do(user => {
      this.authState = user;
      if (user) {
        this.updateOnConnect();
        this.updateOnDisconnect();
      }
    }).subscribe();
    this.defaultProfileImgURL = 'https://firebasestorage.googleapis.com/v0/b/chattycherry-3636c.appspot.com/o/user-default.png?alt=media&token=f85be639-9a1c-4c79-a28d-361171358a41';
    this.usersRef = this.afDB.list<User>(this.usersNode);
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

  determineUserSentFriendRequestToCertainParty(followingUserUID: string) {
    return this.afDB.list(`friend-requests/${followingUserUID}`, ref => ref.orderByChild('uid').equalTo(this.currentUserId)).valueChanges();
  }

  getCurrentUserProfilePhoto() {
    return this.afDB.object(`profilepics/${this.currentUserId}`).valueChanges();
  }

  getCurrentUser() {
    return this.afDB.object(`users/${this.currentUserId}`).valueChanges();
  }

  // getCurrentUser() {
  //   let userRef = this.afDB.list(`users/`, ref => ref.orderByKey().equalTo(this.currentUserId));
  //   this.user$ = userRef.snapshotChanges().map(changes => {
  //     return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
  //   });
  //   return this.user$;
  // }

  getCurrentUsername() {
    return this.afDB.object(`users/${this.currentUserId}/username`).valueChanges();
  }

  getUserActiveStatus(): Observable<any> {
    return this.afDB.object(`users/${this.currentUserId}/currentActiveStatus`).valueChanges();
  }

  getMyFriendsKey() {
    this.friendsListRef$ = this.afDB.list(`friends/${this.currentUserId}`);
    this.friends$ = this.friendsListRef$.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
    return this.friends$;
  }

  getFriends(uid: any) {
    return this.afDB.object(`users/${uid}`).valueChanges();
  }

  deleteLoggedInUser() {
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
  }

  updateEmailVerificationStatus() {
    // TODO: RUN THIS FUNCTION ONLY ONCE.
    if (!this.currentUserEmailVerified) {
      let endpoint = this.usersNode + this.currentUserId;
      let emailVerified = { emailVerified: this.authService.isUserEmailVerified }
      this.afDB.object(endpoint).update(emailVerified).catch(error => console.error('Update User',error));
      console.log("updated email verification status");
    }
  }

  updateCurrentUserActiveStatusTo(status: string) {
    let activeStatus = { currentActiveStatus: status }
    this.afDB.object(`users/${this.currentUserId}`).update(activeStatus).catch(error => console.error('Update CurrentActiveStatus in users node Fails',error));
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
    return this.afDB.object('.info/connected').valueChanges()
                    .do(connected => {
                      let status = connected ? 'online' : 'offline'
                      this.updateCurrentUserActiveStatusTo(status)
                    })
                    .subscribe()
  }

  // Updates status when connection to Firebase ends
  updateOnDisconnect() {
    firebase.database().ref().child(`users/${this.currentUserId}`)
            .onDisconnect()
            .update({currentActiveStatus: 'offline'});
  }

  updateGender(selectedGender: string) {
    let gender = { gender: selectedGender }
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
    this.afDB.list(endpoint).snapshotChanges().take(1).subscribe((snapshot) => {
      snapshot.map(requester => {
        console.log('key', requester.key);
        this.afDB.list(endpoint).remove(requester.key);
      });
    });
  }

  removeUserFromFriendList(UID: string) {
    this.afDB.list(`friends/${this.currentUserId}`).remove(UID);
  }


}