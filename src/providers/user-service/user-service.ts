// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase/app';

import { User } from '../../models/user';

@Injectable()
export class UserServiceProvider {
  usersRef: AngularFireList<any>;
  users$: Observable<User[]>;
  defaultProfileImgURL: string;

  constructor(
    private afAuth: AngularFireAuth,
    private afDB: AngularFireDatabase) {

    this.usersRef = this.afDB.list<User>('users');
    this.users$ = this.usersRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
    this.defaultProfileImgURL = 'https://firebasestorage.googleapis.com/v0/b/chattycherry-3636c.appspot.com/o/user-default.png?alt=media&token=c5c2eb63-9fa1-4259-bbc2-6089ca97c6af';
  }

  getUsers() { return this.users$; }

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

}