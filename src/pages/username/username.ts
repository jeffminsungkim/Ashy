import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { UserServiceProvider } from '@ashy-services/user-service/user-service';

import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/take';


@IonicPage()
@Component({
  selector: 'page-username',
  templateUrl: 'username.html',
})
export class UsernamePage implements OnDestroy {
  subscription: Subscription;
  currentUsername: string;
  usernameText: string;
  isUsernameAvailable: boolean;
  usernameNotValid: boolean = true;
  hasSetUsername: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserServiceProvider) {

    this.currentUsername = this.navParams.get('username');
  }

  saveUsername() {
    this.hasSetUsername = true;
    this.userService.removeDeprecatedUsername(this.currentUsername);
    this.userService.updateUsername(this.usernameText);
    this.currentUsername = this.usernameText;
  }

  checkUsername() {
    // let re = /^[a-z0-9]+$/i;
    // let validUsername = this.usernameText.match(re);
    // if (validUsername === null) {
    //   this.usernameNotValid = true;
    //   console.log("WRONG", this.usernameText);
    // } else {
    //   if (this.usernameText.length > 4 && this.usernameText.length !== 0) {
    //     this.usernameNotValid = false;
    //     console.log("GOOD", this.usernameText);
    //   }
    // }

    if (this.usernameText.length < 5 || this.isUsernameAvailable == false) {
      this.usernameNotValid = true;
      console.log("WRONG", this.usernameText);
    } else {
      if (this.usernameText.length > 4 || this.usernameText.length !== 0 || !this.isUsernameAvailable) {
        this.usernameNotValid = false;
        console.log("GOOD", this.usernameText);
      }
    }
    
    this.subscription = this.userService.checkUsername(this.usernameText).take(1).subscribe(username => {
      console.log("uid:", username);
      if (username === null)
        this.isUsernameAvailable = true;
      else
        this.isUsernameAvailable = false;
    });
  }

  ngOnDestroy() {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
      console.log("Username ngOnDestroy");
    }
  }
}
