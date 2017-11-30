import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { UserServiceProvider } from '../../providers/user-service/user-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';


@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {
  private subscription: Subscription;
  private loggedInUser: any[];
  users: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userService: UserServiceProvider,
    private authService: AuthServiceProvider,
    private events: Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
   
  }

  getVerifiedUsers() {
    const subscription = this.userService.getVerifiedUsers().subscribe(users => {
      this.users = users;
      console.log("UserPage", this.users);
    });
    this.subscription.add(subscription);
  }

  getLoggedInUser() {
    this.subscription = this.userService.getLoggedInUser().subscribe(user => {
      this.loggedInUser = user;
      console.log("Current user:", this.loggedInUser); 
    });
  }

  test() {

  }

  changeStatusMessage() {
    console.log("changeStatusMessage() clicked!");
  }

  ionViewDidEnter() {
    // console.log('Runs when the page has fully entered and is now the active page. This event will fire, whether it was the first load or a cached page.');
  }

  ionViewWillEnter() {
    // console.log('Runs when the page is about to enter and become the active page.');
    this.getLoggedInUser();
    this.getVerifiedUsers();
  }

  ionViewWillLeave() {
    // console.log('Runs when the page is about to leave and no longer be the active page.');
  }

  ionViewDidLeave() {
    console.log('Runs when the page has finished leaving and is no longer the active page.');
    this.subscription.unsubscribe();
  }

  ionViewWillUnload() {
    // console.log('Runs when the page is about to be destroyed and have its elements removed.');
  }

}
