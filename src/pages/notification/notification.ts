import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { ReversePipe } from 'ngx-pipes';

import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/take';

import { UserServiceProvider } from '../../providers/user-service/user-service';

import { User } from '../../models/user';

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
  providers: [ReversePipe]
})
export class NotificationPage implements OnDestroy {
  private subscription: Subscription;
  private segment: string;
  private avatar: string;
  private requestArriavalTime: any;
  private sender: any[];
  private message: string;
  private uid: string;
  private user: User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private userService: UserServiceProvider,
    private reversePipe: ReversePipe) {
    this.segment = 'friends';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }

  ionViewDidEnter() {
    this.getRequestFromUser();
    this.getUser();
  }

  getUser() {
    this.userService.getCurrentUserObject().take(1).subscribe((user: any) => {
     this.user = user; 
     console.log("NOTIFICATION:", this.user);
   });
  }

  getRequestFromUser() {
    this.subscription = this.userService.fetchFriendRequest().subscribe((req: any) => {
      this.reversePipe.transform(req);
      this.sender = req;
      this.message = req.message;
      for (let sender of req)
        this.uid = sender.uid;
      console.log("UID@@", this.uid);
      if (this.uid !== this.userService.currentUserId && this.uid !== undefined)
        this.events.publish('totalRequests:arrived', req.length);
    });
  }

  accpetFriendRequest(requestSenderInfo) {
    this.userService.acceptFriendRequest(requestSenderInfo, this.user);
  }

  declineFriendRequest(requestSenderInfo) {
    this.userService.rejectFriendRequest(requestSenderInfo.uid);
  }

  ngOnDestroy() {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
      console.log("Notifications ngOnDestroy");
    }
  }

}
