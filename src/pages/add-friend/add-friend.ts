import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Subscription } from 'rxjs/Subscription';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';

import { User } from '../../models/user';

import { UserServiceProvider } from '../../providers/user-service/user-service';

@IonicPage()
@Component({
  selector: 'page-add-friend',
  templateUrl: 'add-friend.html',
})
export class AddFriendPage implements OnDestroy {
  private subscription: Subscription;
  private subscriptionBucket: Subscription[];
  private avatar: string;
  private displayName: string;
  private recipientUid: string;
  private usernameText: string;
  private isUserExists: boolean;
  private matchedUserExists: boolean = false;
  private matchedWithCurrentUser;
  private isUserAllowedToSendRequest: boolean = true;
  private username: string;
  private user$: Observable<any>;

  private user: User;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private userService: UserServiceProvider) {

    // this.user$ = this.userService.getCurrentUsername();
  }

  ionViewDidLoad() {
    this.getUser();
  }

  getUser() {
    this.subscription = this.userService.getCurrentUser().subscribe((user: any) => {
     this.user = user; 
   });
  }

  findUserWithUsername() {
    let subscription: any;
    let sub: any;
    let forbiddenChars = '.$[]#/'; //contains the forbidden characters CONDITION NEEDS TO BE IMPLEMENTED

    subscription = this.userService.checkUsername(this.usernameText).take(1).subscribe((uid: any) => {
    console.log("uid", uid);
    if (uid === null)
      this.isUserExists = false;
    else
      this.isUserExists = true;

    if (this.isUserExists && this.usernameText != '') {
      sub = this.userService.getMatchedUser(uid).take(1).subscribe((user: any) => {
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
    // this.subscription.add(subscription);
    // this.subscription.add(sub);
  }

  sendFriendRequest() {
    this.userService.sendFriendRequest(this.recipientUid, this.user).then((res: any) => {
      if (res.status)
        this.isUserAllowedToSendRequest = false;
    });
  }

  verifyUserSentRequestOrNot(uid: string) {
    this.userService.determineUserSentFriendRequestToCertainParty(uid).subscribe(user => {
      console.log("user@@@@@@", user);
      if (user.length > 0)
        this.isUserAllowedToSendRequest = false;
      else
        this.isUserAllowedToSendRequest = true;
    });
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
