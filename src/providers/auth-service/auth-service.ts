import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';

import { User } from '../../models/user';

@Injectable()
export class AuthServiceProvider {

  authState: any = null;

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe((auth) => this.authState = auth);
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