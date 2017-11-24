import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';

import { User } from '../../models/user';

@Injectable()
export class AuthServiceProvider {

  constructor(private afAuth: AngularFireAuth) { }

  login(user: User) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
      .then(userData => resolve(userData),
        err => reject(err));
    });
  }
}