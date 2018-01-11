import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { UserServiceProvider } from '@ashy-services/user-service/user-service';
import { AuthServiceProvider } from '@ashy-services/auth-service/auth-service';
import { ModalServiceProvider } from '@ashy-services/modal-service/modal-service';
import { User } from '@ashy-models/user';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/take'
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/combineLatest';


@IonicPage()
@Component({
  selector: 'page-friend',
  templateUrl: 'friend.html',
})
export class FriendPage {

  subscription: Subscription;
  friends$: Observable<any[]>;
  me$: Observable<User>;
  uid: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public userService: UserServiceProvider,
    public authService: AuthServiceProvider,
    public modalService: ModalServiceProvider) { }

  ionViewDidLoad() { }

  // getRequestFromUser() {
  //   this.subscription = this.userService.fetchFriendRequest().subscribe((req: any) => {
  //     for (let sender of req)
  //       this.uid = sender.uid;
  //     console.log("GET REQUEST FROM FOLLOWING UID", this.uid);
  //     if (this.uid !== this.userService.currentUserId && this.uid !== undefined)
  //       this.events.publish('totalRequests:arrived', req.length);
  //   });
  // }

  ionViewWillEnter() {
    // Runs when the page is about to enter and become the active page.;
    this.getUserProfile();
    this.getMyFriendList();
    // this.getRequestFromUser();

  }

  getMyFriendList() {
    this.friends$ = this.userService.getMyFriendsId().switchMap(data => {
      return Observable.combineLatest(data.map(friend => this.userService.getFriends(friend.key)));
    });
  }

  getUserProfile() {
    this.me$ = this.userService.getCurrentUser();
  }

  deleteUserFromFriendList(user) {
    this.userService.removeUserFromFriendList(user.uid);
    this.getMyFriendList();
  }

  /*showOriginalAvatarImage() {
    console.log("showOriginalAvatarImage()");
  }

  addFriend() {
    this.modalService.showAddFriendModal();
  }

  viewUserProfile(user: User) {
    this.modalService.showProfileModal(user);
  }

  // ngOnDestroy() {
  //   if (this.subscription !== undefined) {
  //     this.subscription.unsubscribe();
  //     console.log("friends ngOnDestroy");
  //   }
  // }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
    console.log("friends ionViewWillLeave");
  }

  ionViewDidLeave() {
    console.log('Runs when the page has finished leaving and is no longer the active page.');
  }*/

}
