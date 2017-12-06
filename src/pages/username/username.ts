import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/take';

import { UserServiceProvider } from '../../providers/user-service/user-service';

@IonicPage()
@Component({
  selector: 'page-username',
  templateUrl: 'username.html',
})
export class UsernamePage implements OnDestroy {
  private subscription: Subscription;
  private currentUsername: string;
  private usernameText: string;
  private isUsernameAvailable: boolean;
  private usernameNotValid: boolean = true;
  private hasSetUsername: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userService: UserServiceProvider) {

    this.currentUsername = this.navParams.get('username');
  }

  saveUsername() {
    this.hasSetUsername = true;
    this.userService.removeDeprecatedUsername(this.currentUsername);
    this.userService.updateUsername(this.usernameText);
    this.currentUsername = this.usernameText;
  }

  checkUsername() {
    let re = /^[a-z0-9]+$/i;
    let validUsername = this.usernameText.match(re);
    console.log("VALID USERNAME:", validUsername);

    if (validUsername === null) {
      this.usernameNotValid = true;
      console.log("WRONG", this.usernameText);
    } else {
      if (this.usernameText.length > 4 && this.usernameText.length !== 0) {
        this.usernameNotValid = false;
        console.log("GOOD", this.usernameText);
      }
    }
    
    this.subscription = this.userService.checkUsername(this.usernameText).take(1).subscribe(username => {
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
