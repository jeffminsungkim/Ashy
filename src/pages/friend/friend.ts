import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import 'rxjs/add/operator/take'
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { UserServiceProvider } from '../../providers/user-service/user-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ModalServiceProvider } from '../../providers/modal-service/modal-service';

@IonicPage()
@Component({
  selector: 'page-friend',
  templateUrl: 'friend.html',
})
export class FriendPage {

  private subscription: Subscription;
  // private loggedInUser: Observable<any[]>;
  private currentUser: any[];
  private avatar: string;
  private displayName: string;
  private statusMessage: string;
  private friends: any[];
  private uid: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private userService: UserServiceProvider,
    private authService: AuthServiceProvider,
    private modalService: ModalServiceProvider) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
  }

  getRequestFromUser() {
    this.subscription = this.userService.fetchFriendRequest().subscribe((req: any) => {
      console.log("REQUEST@@:", req);
      for (let sender of req)
        this.uid = sender.senderUID;
      console.log("UID@@", this.uid);
      if (this.uid !== this.userService.currentUserId && this.uid !== undefined)
        this.events.publish('totalRequests:arrived', this.uid, req.length);
    });
  }

  ionViewWillEnter() {
    // Runs when the page is about to enter and become the active page.;
    this.getUserProfile();
    this.getRequestFromUser();
    // this.getFriendsList();
  }

  // getFriendsList() {
  //   const subscription = this.userService.getVerifiedUsers().take(1).subscribe(users => {
  //     this.friends = users;
  //     console.log("UserPage", this.friends);
  //   });
  //   this.subscription.add(subscription);
  // }

  getUserProfile() {
    this.subscription = this.userService.getCurrentUser().take(1).subscribe((user: any) => {
      console.log("Current user:", user);
      this.avatar = user.photoURL;
      this.displayName = user.displayName;
      this.statusMessage = "I've had a pretty messed up day. If we just...";
    });
  }

  // getUserProfile() {
  //   this.subscription = this.userService.getCurrentUser().take(1).subscribe((user: any) => {
  //     console.log("Current user:", user);
  //     this.currentUser = user;
  //     this.statusMessage = "I've had a pretty messed up day. If we just...";
  //   });
  // }

  showOriginalAvatarImage() {
    console.log("showOriginalAvatarImage()");
  }

  addFriend() {
    this.modalService.showAddFriendModal();
  }

  viewUserProfile() {
    this.modalService.showProfileModal();
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
  }

}
