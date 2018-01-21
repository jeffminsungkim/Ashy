import { Injectable } from '@angular/core';

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

  updateDisplayname(name: string) {
    this.afAuth.auth.currentUser.updateProfile({
      displayName: name,
      photoURL: ''
    }).then(() => console.log('Updated user profile.')).catch((err) => console.log(err));
  }

  updateEmailAddress(newEmail: string) {
    return new Promise((resolve, reject) => {
      firebase.auth().currentUser.updateEmail(newEmail).then(() => resolve({status: true})).catch(err => reject(err));
    });
  }

  emailSignUp(user: EmailSignup) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password).then((auth) => {
        if (auth && !auth.emailVerified)
          auth.sendEmailVerification().then(() => {
            console.log('Verification email has sent.');
            resolve({status: true, message: `Signed up as ${auth.email}`});
          }).catch(err => reject(err));
        }).catch(err => reject(err));
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
