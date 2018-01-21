import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '@ashy-services/auth-service/auth-service';
import { ToastServiceProvider } from '@ashy-services/toast-service/toast-service';
import { UserServiceProvider } from '@ashy-services/user-service/user-service';


@IonicPage()
@Component({
  selector: 'page-profile-preset',
  templateUrl: 'profile-preset.html',
})
export class ProfilePresetPage {
  public displayName: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    private authService: AuthServiceProvider,
    private toastService: ToastServiceProvider,
    private userService: UserServiceProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePresetPage');
  }

  uploadProfilePicture() {

  }

  startApp() {
    this.authService.updateDisplayname(this.displayName);
    this.userService.updateDisplayname(this.displayName);
    this.userService.updateCurrentUserActiveStatusTo('firstlogin');
    this.userService.updateLastLoginTime();
    this.userService.updateAppMetaData();
    this.toastService.show(`Signed in as ${this.userService.currentUserEmail}`);
    this.userService.updateCurrentUserAppUsageStatusTo(true, 'firstlogin');
    this.navCtrl.setRoot('HomePage');
  }

}
