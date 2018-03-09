import { Component, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import { UserServiceProvider } from '@ashy/services/user-service/user-service';
import { StringInspector } from '@ashy/services/utility-service/string-inspector';
import { User } from '@ashy/models/user';

import * as jdenticon from 'jdenticon';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { EmptyObservable } from 'rxjs/observable/EmptyObservable';
import { map, take, switchMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { combineLatest } from 'rxjs/observable/combineLatest';


@IonicPage()
@Component({
  selector: 'page-add-friend',
  templateUrl: 'add-friend.html',
})
export class AddFriendPage {
  @ViewChild('searchInput') searchInput;
  private subscription: Subscription;
  me: User;
  magnify: string = 'assets/svgs/magnify-200.svg';
  currentUserId: string;
  usernameText: string;
  isUserAllowedToSendRequest: boolean = true;
  foundSpecialChar: boolean = false;
  wellFormatedUsername: boolean = false;
  matchedUser$: Observable<any>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private http: HttpClient,
    private stringInspector: StringInspector,
    private userService: UserServiceProvider) {
    this.currentUserId = this.userService.currentUserId;
    this.me = this.navParams.get('me');
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.searchInput.setFocus();
    }, 500);
  }

  findUserWithUsername() {

    if (this.usernameText === '') return;

    if (this.usernameText) {
      if (this.stringInspector.isStringContainsSpecialChar(this.usernameText)) {
        this.foundSpecialChar = true;
        return;
      } else if (!this.stringInspector.isStringContainsAlphanumeric(this.usernameText)) {
        this.wellFormatedUsername = false;
        return;
      } else {
        this.foundSpecialChar = false;
        this.wellFormatedUsername = true;
      }
    }

    this.matchedUser$ = this.userService.checkUsername(this.usernameText).switchMap(usernamesRef => {
      return (usernamesRef === null || usernamesRef === undefined) ? of(usernamesRef) :
      combineLatest(Object.keys(usernamesRef).map(key => this.userService.getMatchedUser(usernamesRef[key])));
    });
  }
  sendFriendRequest(user: User) {
    this.afAuth.auth.currentUser.getIdToken().then(idToken => {
      const url = 'https://us-central1-ashy-development.cloudfunctions.net/addFriendDbFriendRequests/';
      console.log('idToken:', idToken);
      console.log('json format:', JSON.stringify(user));
      this.http.post(url, JSON.stringify(user), {
        headers: {'Authorization': idToken, 'Content-Type': 'application/json; charset=utf-8'}
      }).subscribe((res) => {
        console.log('res?', res);
        // this.isUserAllowedToSendRequest = false;
      });
    });
  }

  /*verifyUserSentRequestOrNot(uid: string) {
    let sub = this.userService.determineUserSentFriendRequestToCertainParty(uid).subscribe(user => {
      console.log("Add Friend Verify Requests", user);
      if (user.length > 0)
        this.isUserAllowedToSendRequest = false;
      else
        this.isUserAllowedToSendRequest = true;
    });
    this.subscription.add(sub);
  }*/

  closePage() {
    this.navCtrl.pop();
  }

}
