import { Injectable } from '@angular/core';

import { UtilityServiceProvider } from '@ashy-services/utility-service/utility-service';

import { EmailSignup } from '@ashy-models/emailsignup';
import { User } from '@ashy-models/user';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

import { ErrorDetectionServiceProvider } from '../error-detection-service/error-detection-service';

import { Observable } from 'rxjs/Observable';



@Injectable()
export class AuthServiceProvider {

  authState: any = null;
  defaultProfileImgURL: string;
  private usersRef: AngularFirestoreCollection<User>;

  constructor(
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    public utilityService: UtilityServiceProvider,
    public errorDetectionService: ErrorDetectionServiceProvider) {
      this.usersRef = this.afs.collection<User>('users');
      this.afAuth.authState.subscribe((auth) => this.authState = auth);
      this.defaultProfileImgURL = 'https://firebasestorage.googleapis.com/v0/b/ashy-dev-3662f.appspot.com/o/avatar-placeholder%2Favatar.png?alt=media&token=b914dee7-cdee-44ec-8222-146c9f6f3ef8';
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

  resetPassword(email: string) {
    return new Promise((resolve, reject) => {
      firebase.auth().sendPasswordResetEmail(email).then(() => {resolve({status: true});
    }).catch(err => reject(err));
    });
  }

  emailSignUp(user: EmailSignup) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password).then((auth) => {
        if (auth && !auth.emailVerified)
          auth.sendEmailVerification().then(() => {console.log("Email SENT!!!!!!");})
        this.afAuth.auth.currentUser.updateProfile({
          displayName: user.displayName,
          photoURL: this.defaultProfileImgURL
        }).then(() => {
          this.usersRef.doc(auth.uid).set({
          uid: auth.uid,
          email: auth.email,
          displayName: user.displayName,
          photoURL: this.defaultProfileImgURL,
          statusMessage: '',
          username: this.utilityService.generateRandomUsername(),
          currentActiveStatus: 'signout',
          lastLoginAt: null,
          emailVerified: false,
          signupAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => resolve({status: true, message: `Signed up as ${auth.email}`})).catch(err => reject(err))
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
