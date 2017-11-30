// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';

import { AuthServiceProvider } from '../auth-service/auth-service';

import { User } from '../../models/user';

@Injectable()
export class UserServiceProvider {
  private usersRef: AngularFireList<any>;
  private users$: Observable<User[]>;
  private authState: any = null;
  private usersNode: string;
  private defaultProfileImgURL: string;

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

  get currentUserPhotoURL(): string {
    return this.authState['photoURL'];
  }

  getUsers() { return this.users$; }

  getVerifiedUsers() {
    let usersRef = this.afDB.list(this.usersNode, ref => ref.orderByChild('emailVerified').equalTo(true));
    this.users$ = usersRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });

    return this.users$;
  }

  getLoggedInUser(): Observable<any> {
    return this.afDB.list(this.usersNode, ref => ref.orderByKey().equalTo(this.currentUserId)).valueChanges();
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
    let endpoint = this.usersNode + this.currentUserId;
    let data = { emailVerified: this.authService.isUserEmailVerified }
    this.afDB.object(endpoint).update(data).catch(error => console.error('Update User',error));
  }

}