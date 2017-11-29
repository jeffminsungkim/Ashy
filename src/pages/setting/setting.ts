import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { ToastServiceProvider } from '../../providers/toast-service/toast-service';
import { ModalServiceProvider } from '../../providers/modal-service/modal-service';

import { ProfilePage } from '../profile/profile';

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

  constructor(
    private app: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthServiceProvider,
    private userService: UserServiceProvider,
    private toastService: ToastServiceProvider,
    private modalService: ModalServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }

  ionViewWillLeave() {
    console.log("Looks like I'm about to leave :(");

  }

  goToProfile() {
    let emailVerified = true;
    this.modalService.showProfileModal(emailVerified);
  }

  async logout() {
    const user: any = await this.authService.signOut();
    this.app.getRootNav().setRoot('LoginPage');
    this.toastService.show(`Signed out as ${user.email}`);
  }

  async deleteAccount() {
    // TODO: DELETE ACCOUNT FROM THE FOLLOWING CONDITION:
    // USER SHOULD TYPE THEIR EMAIL ACCOUNT IN TEXT INPUT
    // AND INPUT STRING MUST MATCH WITH THE USER'S EMAIL ACCOUNT. 
    this.userService.deleteLoggedInUser();
    const res: any = await this.authService.deleteAccount();
    if (res.status) 
      this.app.getRootNav().setRoot('LoginPage');
    else
      console.log("Delete Account error");
  }
}