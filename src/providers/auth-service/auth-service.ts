import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { ErrorDetectionServiceProvider } from '../error-detection-service/error-detection-service';

import * as firebase from 'firebase/app';

import { User } from '../../models/user';

@Injectable()
export class AuthServiceProvider {
  private authState: any = null;
  private defaultProfileImgURL: string;

  constructor(
    private afAuth: AngularFireAuth,
    private afDB: AngularFireDatabase,
    private errorDetectionService: ErrorDetectionServiceProvider) {
    this.afAuth.authState.subscribe((auth) => this.authState = auth);
    this.defaultProfileImgURL = 'https://firebasestorage.googleapis.com/v0/b/chattycherry-3636c.appspot.com/o/user-default.png?alt=media&token=f85be639-9a1c-4c79-a28d-361171358a41';
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  // Returns current user data
  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
    // return this.authState.uid;
  }

  get currentUserDisplayName(): string {
    return this.authState['displayName'];
  }

  get currentUserEmail(): string {
    return this.authState['email'];
  }

  get isUserEmailVerified(): any {
    return this.authState.emailVerified;
  }

   get currentUserObservable(): any {
    return this.afAuth.authState
  }

  sendEmailVerification() {
    this.currentUser.sendEmailVerification();
  }

  resetPassword(email: string) {
    return new Promise((resolve, reject) => {
      firebase.auth().sendPasswordResetEmail(email).then(() => {resolve({status: true});
    }).catch(err => reject(err));
    });
  } 

  emailSignUp(user: User) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password).then((auth) => {
        if (auth && !auth.emailVerified) 
          auth.sendEmailVerification().then(() => {console.log("Email SENT!!!!!!");})
        this.afAuth.auth.currentUser.updateProfile({
          displayName: user.displayName,
          photoURL: this.defaultProfileImgURL
        }).then(() => {
          this.afDB.object(`users/${auth.uid}`).update({
          uid: auth.uid,
          email: auth.email,
          emailVerified: auth.emailVerified,
          displayName: user.displayName,
          gender: user.gender,
          photoURL: this.defaultProfileImgURL,
          currentActiveStatus: false
        }).then(() => resolve({status: true, message: `Signed up as ${auth.email}`, emailVerified: this.isUserEmailVerified})).catch(err => reject(err))
        }).catch(err => reject(err))
      }).catch(err => reject(err))
    });
  }

  emailLogin(user: User) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
      .then(user => resolve(user)).catch((error) => {
        let errorMessage = this.errorDetectionService.inspectAnyErrors(error.code);
        reject({message: errorMessage});
      });
    });
  }

  signOut() {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signOut().then(_ => resolve({email: this.currentUserEmail}),
        err => reject(err));
    });
  }

  deleteAccount() {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.currentUser.delete().then(_ => resolve({status: true})).catch(error => reject({status: false, message: error}));
    });
  }
}