// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

import * as firebase from 'firebase/app';

import { User } from '../../models/user';

@Injectable()
export class UserServiceProvider {
  usersRef: AngularFireList<any>;
  users$: Observable<User[]>;

  constructor(
    private afAuth: AngularFireAuth,
    private afDB: AngularFireDatabase,
    private authService: AuthServiceProvider) {

    this.usersRef = this.afDB.list<User>('users');
    this.users$ = this.usersRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });

  }

  getUsers() { return this.users$; }


  updateEmailVerificationStatus() {
    let endpoint = 'users/' + this.authService.currentUserId + '/';
    let data = {
      emailVerified: this.authService.isUserEmailVerified
    }
    this.afDB.object(endpoint).update(data).catch(error => console.error('Update User',error));
  }

}