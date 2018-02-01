import { Component, ViewChild, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  // findUserWithUsername() {
  //   let subscription: Subscription;
  //   let sub: Subscription;
  //   console.log('findUserWithUsername()');

  //   if (this.usernameText === '') {
  //     this.foundSpecialChar = false;
  //     console.log('no words, return!');
  //     return;
  //   }

  //   if (this.usernameText) {
  //     if (this.utilityService.isStringContainsSpecialChar(this.usernameText)) {
  //       this.foundSpecialChar = true;
  //       return;
  //     } else if (!this.utilityService.isStringContainsEnglishOrNumericChar(this.usernameText)) {
  //       this.wellFormatedUsername = false;
  //       return;
  //     } else {
  //       this.foundSpecialChar = false;
  //       this.wellFormatedUsername = true;
  //     }
  //   }

  //   this.userService.checkUsername(this.usernameText).take(1).subscribe((usernamesRef: any) => {
  //     console.log("usernamesRef", usernamesRef);
  //     if (usernamesRef === null) {
  //       this.foundMatchedUser = false;
  //       console.log('return!!!!!!');
  //       return;
  //     }
  //     this.foundMatchedUser = true;
  //     Object.keys(usernamesRef).map((key) => this.uid = usernamesRef[key]);
  //     console.log('uid:', this.uid );
  //     this.getMatchedUser();
  //     this.foundMatchedUser = false;
  //   });
  // }

  // private getMatchedUser() {
  //   this.userService.getMatchedUser(this.uid).take(1).subscribe((user: any) => {
  //     console.log('getMatchedUser()');
  //     // this.verifyUserSentRequestOrNot(user.uid);
  //     this.avatar = user.thumbnailURL;
  //     this.displayName = user.displayName;
  //     this.recipientUid = user.uid;
  //     this.foundMatchedUser = true;
  //     (this.currentUserId === user.uid) ? this.matchedWithCurrentUser = true : this.matchedWithCurrentUser = false;
  //   });
  // }

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
