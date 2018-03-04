import { Injectable } from '@angular/core';

import { EmailSignup } from '@ashy/models/emailsignup';
import { User } from '@ashy/models/user';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';


@Injectable()
export class AuthServiceProvider {

  authState: any = null;
  private usersRef: AngularFirestoreCollection<User>;

  constructor(
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore) {
      this.usersRef = this.afs.collection<User>('users');
      this.afAuth.authState.subscribe((auth) => this.authState = auth);
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  // Returns current user data
  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  get currentUserEmail(): string {
    return this.authState['email'];
  }

  sendEmailVerification() {
    this.currentUser.sendEmailVerification();
  }

  reAuthenticate(password: string) {
    const credentials = firebase.auth.EmailAuthProvider.credential(this.currentUserEmail, password);
    return this.currentUser.reauthenticateWithCredential(credentials);
  }

  resetPassword(email: string) {
    return new Promise((resolve, reject) => {
      firebase.auth().sendPasswordResetEmail(email).then(() => {resolve({status: true});
    }).catch(err => reject(err));
    });
  }

  updateEmailAddress(newEmail: string) {
    return new Promise((resolve, reject) => {
      firebase.auth().currentUser.updateEmail(newEmail).then(() => resolve({status: true})).catch(err => reject(err));
    });
  }

  emailSignUp(user: EmailSignup) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
      .then(auth => resolve({status: true, uid: auth.uid, message: `Signed up as ${auth.email}`}))
      .catch(err => reject(err));
    });
  }

  emailLogin(user: EmailSignup) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
      .then(user => resolve(user))
      .catch(err => reject(err));
    });
  }

  twitterLogin(token, secret) {
    const credential = firebase.auth.TwitterAuthProvider.credential(token, secret);
    return this.oAuthLogin(credential);
  }

  private oAuthLogin(credential) {
   return this.afAuth.auth.signInWithCredential(credential);
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
