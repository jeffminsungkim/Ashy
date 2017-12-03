import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { ToastServiceProvider } from '../../providers/toast-service/toast-service';
import { ModalServiceProvider } from '../../providers/modal-service/modal-service';
import { UploadServiceProvider } from '../../providers/upload-service/upload-service';

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthServiceProvider,
    private userService: UserServiceProvider,
    private toastService: ToastServiceProvider,
    private modalService: ModalServiceProvider,
    private uploadService: UploadServiceProvider) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }


  goToProfile() {
    let validation = { emailVerified: true };
    this.modalService.showProfileModal(validation);
  }

  async logout() {
    const user: any = await this.authService.signOut();
    this.toastService.show(`Signed out as ${user.email}`);
  }

  deleteAccount() {
    // TODO: DELETE ACCOUNT FROM THE FOLLOWING CONDITION:
    // USER SHOULD TYPE THEIR EMAIL ACCOUNT IN TEXT INPUT
    // AND INPUT STRING MUST MATCH WITH THE USER'S EMAIL ACCOUNT. 
    this.uploadService.deleteFileNode();
    this.uploadService.deleteFileStorage();
    this.userService.deleteLoggedInUser();
    this.authService.deleteAccount();
  }
}