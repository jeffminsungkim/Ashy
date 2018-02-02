import { Component, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import { UserServiceProvider } from '@ashy-services/user-service/user-service';
import { UtilityServiceProvider } from '@ashy-services/utility-service/utility-service';
import { User } from '@ashy-models/user';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { EmptyObservable } from 'rxjs/observable/EmptyObservable';
import { map, take, switchMap } from 'rxjs/operators';


@IonicPage()
@Component({
  selector: 'page-add-friend',
  templateUrl: 'add-friend.html',
})
export class AddFriendPage implements OnDestroy {

  @ViewChild('searchInput') searchInput;
  private subscription: Subscription;
  public me: User;
  public magnify: string = 'assets/svgs/magnify-200.svg';
  public currentUserId: string;
  public usernameText: string;
  isUserAllowedToSendRequest: boolean = true;
  public foundSpecialChar: boolean = false;
  public wellFormatedUsername: boolean = false;
  public matchedUser$: Observable<any>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private http: HttpClient,
    private userService: UserServiceProvider,
    private utilityService: UtilityServiceProvider) {
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
      if (this.utilityService.isStringContainsSpecialChar(this.usernameText)) {
        this.foundSpecialChar = true;
        return;
      } else if (!this.utilityService.isStringContainsEnglishOrNumericChar(this.usernameText)) {
        this.wellFormatedUsername = false;
        return;
      } else {
        this.foundSpecialChar = false;
        this.wellFormatedUsername = true;
      }
    }

    this.matchedUser$ = this.userService.checkUsername(this.usernameText).switchMap(usernamesRef => {
      if (usernamesRef === null || usernamesRef === undefined) return new EmptyObservable();
      return Observable.combineLatest(Object.keys(usernamesRef).map(key => this.userService.getMatchedUser(usernamesRef[key])));
    });
  }
  sendFriendRequest(user: User) {
    console.log('request user:', user);

    this.afAuth.auth.currentUser.getIdToken().then(idToken => {
      console.log('idToken:', idToken);
      console.log('json format:', JSON.stringify(user));
      this.http.post('https://us-central1-ashy-dev-3662f.cloudfunctions.net/sendfrDbFriendRequests/api/v1/friend-requests/', JSON.stringify(user), {
        headers: {'Authorization': idToken, 'Content-Type': 'application/json; charset=utf-8'}
      }).subscribe((res) => {
        console.log('res?', res);
      });
    });

    // this.userService.sendFriendRequest(this.recipientUid, this.user).then((res: any) => {
    //   if (res.status)
    //     this.isUserAllowedToSendRequest = false;
    // });
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

  ngOnDestroy() {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
      console.log("AddFriendPage ngOnDestroy");
    }
  }

}
