import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';

import { User } from '../../models/user';

@Injectable()
export class AuthServiceProvider {

  authState: any = null;
  defaultProfileImgURL: string;

  constructor(private afAuth: AngularFireAuth, private afDB: AngularFireDatabase) {
    this.afAuth.authState.subscribe((auth) => this.authState = auth);
    this.defaultProfileImgURL = 'https://firebasestorage.googleapis.com/v0/b/chattycherry-3636c.appspot.com/o/user-default.png?alt=media&token=c5c2eb63-9fa1-4259-bbc2-6089ca97c6af';
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
  }

  get currentUserDisplayName(): string {
    return this.authState['displayName'];
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

  emailSignUp(user: User) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password).then((auth) => {
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
          photoURL: this.defaultProfileImgURL
        }).then(_ => resolve({status: true, message: `Signed up as ${auth.email}`}));
      }).catch(err => reject({status: false, message: err}))
      });
    });
  }

  emailLogin(user: User) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
      .then(user => resolve(user)).catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        if (errorCode === 'auth/invalid-email') {
          reject({message: 'Email address is not valid.'});
        } else if (errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found') {
          reject({message: 'Please double check your account.'});
        } else if (errorCode === 'auth/user-disabled') {
          reject({message: 'Your account is suspended.'});
        } else {
          reject(error);
        }
      });
    });
  }

  signOut() {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signOut().then(res => resolve(res),
        err => reject(err));
    });
  }
}