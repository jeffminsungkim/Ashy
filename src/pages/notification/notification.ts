import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { ReversePipe } from 'ngx-pipes';

import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/take';


import { UserServiceProvider } from '../../providers/user-service/user-service';

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

  ionViewWillEnter() {
    this.getRequestFromUser();
  }

  getRequestFromUser() {
    this.subscription = this.userService.fetchFriendRequest().subscribe((req: any) => {
      this.events.publish('totalRequests:arrived', req.length);
      this.reversePipe.transform(req);
      this.sender = req;
      this.message = req.message;
      console.log('type', typeof this.sender);
      console.log('sender', this.sender);
    });
  }

  declineFriendRequest(userInfo) {
    console.log("userinfo!!!!!", userInfo);
    console.log("sender!!!!", userInfo.sender);
    this.userService.rejectFriendRequest(userInfo.sender);
  }

  ngOnDestroy() {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
      console.log("Notifications ngOnDestroy");
    }
  }

}
