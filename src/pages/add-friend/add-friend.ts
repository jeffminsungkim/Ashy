import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Subscription } from 'rxjs/Subscription';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';

import { UserServiceProvider } from '../../providers/user-service/user-service';

import { User } from '../../models/user';

@IonicPage()
@Component({
  selector: 'page-add-friend',
  templateUrl: 'add-friend.html',
})
export class AddFriendPage implements OnDestroy {
  subscription: Subscription;
  avatar: string;
  displayName: string;
  recipientUid: string;
  usernameText: string;
  isUserExists: boolean;
  isUserAllowedToSendRequest: boolean = true;
  matchedUserExists: boolean = false;
  matchedWithCurrentUser;
  user$: Observable<any>;
  user: User;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public userService: UserServiceProvider) {

    // this.user$ = this.userService.getCurrentUsername();
  }

  ionViewDidLoad() {
    this.getUser();
  }

  getUser() {
    this.subscription = this.userService.getCurrentUserObject().subscribe((user: any) => {
      this.user = user;
   });
  }

  findUserWithUsername() {
    let subscription: Subscription;
    let sub: Subscription;
    let forbiddenChars = '.$[]#/'; //contains the forbidden characters CONDITION NEEDS TO BE IMPLEMENTED

    this.userService.checkUsername(this.usernameText).take(1).subscribe((uid: any) => {
    console.log("uid", uid);
    if (uid === null)
      this.isUserExists = false;
    else
      this.isUserExists = true;

    if (this.isUserExists && this.usernameText != '') {
      this.userService.getMatchedUser(uid).take(1).subscribe((user: any) => {
      console.log("MATCHED USER:", user);
      this.verifyUserSentRequestOrNot(user.uid);
      this.avatar = user.photoURL;
      this.displayName = user.displayName;
      this.recipientUid = user.uid;
      this.matchedUserExists = true;

      if (this.userService.currentUserId === user.uid)
        this.matchedWithCurrentUser = true;
      else
        this.matchedWithCurrentUser = false;
    });
    }
    this.matchedUserExists = false;
  });
  }

  sendFriendRequest() {
    this.userService.sendFriendRequest(this.recipientUid, this.user).then((res: any) => {
      if (res.status) 
        this.isUserAllowedToSendRequest = false;
    });
  }

  verifyUserSentRequestOrNot(uid: string) {
    let sub = this.userService.determineUserSentFriendRequestToCertainParty(uid).subscribe(user => {
      console.log("Add Friend Verify Requests", user);
      if (user.length > 0)
        this.isUserAllowedToSendRequest = false;
      else
        this.isUserAllowedToSendRequest = true;
    });
    this.subscription.add(sub);
  }

  backToPreviousView() {
    this.navCtrl.pop();
  }

  ngOnDestroy() {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
      console.log("AddFriendPage ngOnDestroy");
    }
  }

}
