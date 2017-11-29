import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';

import { Observable } from 'rxjs/Observable';

import { User } from '../../models/User';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  user = {} as User;
  avatar: string;
  displayName: string;
  user$: Observable<any>;
  emailVerified: boolean;

  constructor(
    public navParams: NavParams,
    public navCtrl: NavController,
    private viewCtrl: ViewController,
    private authService: AuthServiceProvider,
    private userService: UserServiceProvider,
    private alertService: AlertServiceProvider) {

    this.emailVerified = navParams.get('emailVerified');
  }

  ionViewDidLoad() {
    // this.user$ = this.authService.currentUserObservable.subscribe((user) => console.log("IAM USER!", user));
    this.avatar = this.userService.currentUserPhotoURL;
    this.displayName = this.userService.currentUserDisplayName;
  }

  requestEmailVerification() {
    this.authService.sendEmailVerification();
    this.alertService.presentEmailIsSent(this.viewCtrl);
  }

  backToPreviousView() {
    this.navCtrl.pop();
  }

}