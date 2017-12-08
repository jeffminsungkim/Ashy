// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';

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

  constructor(
    private afAuth: AngularFireAuth,
    private afDB: AngularFireDatabase,
    private authService: AuthServiceProvider) {


    this.usersNode = 'users/';
    this.afAuth.authState.subscribe((auth) => this.authState = auth);
    this.defaultProfileImgURL = 'https://firebasestorage.googleapis.com/v0/b/chattycherry-3636c.appspot.com/o/user-default.png?alt=media&token=f85be639-9a1c-4c79-a28d-361171358a41';
    this.usersRef = this.afDB.list<User>(this.usersNode);
    // this.usersRef = this.afDB.list<User>('users');
    // this.users$ = this.usersRef.snapshotChanges().map(changes => {
    //   return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    // });
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
    return this.afDB.list(`friend-requests/${followingUserUID}`, ref => ref.orderByChild('sender').equalTo(this.currentUserId)).valueChanges();
  }

  // getVerifiedUsers() {
  //   let usersRef = this.afDB.list(this.usersNode, ref => ref.orderByChild('emailVerified').equalTo(true));
  //   this.users$ = usersRef.snapshotChanges().map(changes => {
  //     return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
  //   });

  //   return this.users$;
  // }

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

  // getUserActiveStatus(): Observable<any> {
  //   return this.afDB.list(`users/${this.currentUserId}`, ref => ref.orderByKey().equalTo('displayName')).valueChanges();
  // }

  getUserActiveStatus(): Observable<any> {
    return this.afDB.object(`users/${this.currentUserId}/currentActiveStatus`).valueChanges();
  }

  // getLoggedInUser() {
  //   return this.afDB.list(this.usersNode, ref => ref.orderByKey().equalTo(this.currentUserId)).valueChanges();
  // }

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

  updateCurrentActiveStatusTo(isActive: boolean) {
    let activeStatus = { currentActiveStatus: isActive }
    this.afDB.object(`users/${this.currentUserId}`).update(activeStatus).catch(error => console.error('Update CurrentActiveStatus Fails',error));
  }

  updateGender(selectedGender: string) {
    let gender = { gender: selectedGender }
    this.afDB.object(`users/${this.currentUserId}`).update(gender).catch(error => console.error('Update Gender Fails', error));
  }

  checkUsername(username: string) {
    username = username.toLowerCase();
    return this.afDB.object(`usernames/${username}`).valueChanges();
  }

  updateUsername(username: string) {
    let data = {};
    data[username] = this.currentUserId;
    this.afDB.object(`users/${this.currentUserId}`).update({'username': username});
    this.afDB.object(`usernames`).update(data);
  }

  removeDeprecatedUsername(username: string) {
    this.afDB.object(`usernames/${username}`).remove();
  }

  getMatchedUser(UID: string) {
    return this.afDB.object(`users/${UID}`).valueChanges();
  }

  sendFriendRequest(recipient: string, sender: User) {
    let senderInfo = {
      sender: sender.uid,
      username: sender.username,
      photoURL: sender.photoURL,
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

  rejectFriendRequest(UID: string) {
    this.afDB.list(`friend-requests/${this.currentUserId}`, ref => ref.orderByChild('sender').equalTo(UID)).query.once('value', (snapshot) => {
      console.log("RESULTS", snapshot);
      let values = snapshot.val();
      console.log("values", values);
      let key = Object.keys(values);
      console.log("KEYS", key);
      this.afDB.list(`friend-requests/${this.currentUserId}`).remove(key[0]);
    });
  }


}