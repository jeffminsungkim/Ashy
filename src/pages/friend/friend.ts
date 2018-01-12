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
  me: User;
  uid: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public userService: UserServiceProvider,
    public authService: AuthServiceProvider,
    public modalService: ModalServiceProvider) {

      this.me$ = this.userService.getCurrentUser();
    }

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

  ionViewWillLeave() {
    console.log("friends ionViewWillLeave");
    if (this.subscription !== undefined) this.subscription.unsubscribe();
  }

  getMyFriendList() {
    this.friends$ = this.userService.getMyFriendsId().switchMap(data => {
      return Observable.combineLatest(data.map(friend => this.userService.getFriends(friend.key)));
    });
  }

  getUserProfile() {
    this.subscription = this.me$.subscribe(user => this.me = user);
  }

  deleteUserFromFriendList(user) {
    this.userService.removeUserFromFriendList(user.uid);
    // this.getMyFriendList();
  }

  showOriginalAvatarImage() {
    console.log("showOriginalAvatarImage()");
  }

  addFriend() {
    this.modalService.showAddFriendModal();
  }

  viewUserProfile() {
    console.log('me:', this.me);
    this.modalService.showProfileModal(this.me);
  }
}
