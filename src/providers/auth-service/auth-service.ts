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

  get isUserEmailVerified(): any {
    return this.authState.emailVerified;
  }

   get currentUserObservable(): any {
    return this.afAuth.authState
  }

  sendEmailVerification() {
      this.currentUser.sendEmailVerification().then(() => {
      console.log("Email Sent!!!!");
    });
  }

  emailLogin(user: User) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
      .then(user => resolve(user), err => reject(err));
    });
  }

  signOut() {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signOut().then(res => resolve(res),
        err => reject(err));
    });
  }
}