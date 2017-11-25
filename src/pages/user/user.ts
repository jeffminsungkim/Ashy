import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { UserServiceProvider } from '../../providers/user-service/user-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';


@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {
  users: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userService: UserServiceProvider,
    private authService: AuthServiceProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
    this.userService.getListOfUsers().subscribe(users => {
      this.users = users;
      console.log("UserPage", this.users);
    });
  }

}
