// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { User } from '../../models/user';

@Injectable()
export class UserServiceProvider {

  usersRef: AngularFireList<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase) {
    this.usersRef = this.db.list('users');
  }

  register(user: User) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password).then(userData => resolve(userData),
        err => reject(err));
    });
  }
}