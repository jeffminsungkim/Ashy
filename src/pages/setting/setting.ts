import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { AuthServiceProvider } from '@ashy/services/auth-service/auth-service';
import { LocalStorageServiceProvider } from '@ashy/services/local-storage-service/local-storage-service';
import { InterfaceOption } from '@ashy/services/interface-option//interface-option';
import { UserServiceProvider } from '@ashy/services/user-service/user-service';
import { ModalServiceProvider } from '@ashy/services/modal-service/modal-service';
import { UploadServiceProvider } from '@ashy/services/upload-service/upload-service';
import { User } from '@ashy/models/user';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/take';


@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  subscription: Subscription;
  uid: string;
  username: string;
  user: Observable<User>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private interfaceOpt: InterfaceOption,
    private localStorageService: LocalStorageServiceProvider,
    public authService: AuthServiceProvider,
    public userService: UserServiceProvider,
    public modalService: ModalServiceProvider,
    public uploadService: UploadServiceProvider) { this.uid = this.userService.currentUserId; }


  ionViewWillEnter() {
    this.user = this.userService.getCurrentUser();
  }

  goToProfileDetail() {
    this.modalService.showProfileDetailModal();
  }

  async logout() {
    this.localStorageService.clearStorage();
    this.userService.updateCurrentUserActiveStatusTo('signout');
    this.userService.updateCurrentUserAppUsageStatusTo(false, 'signout');
    const user: any = await this.authService.signOut();
    this.toastCtrl.create(this.interfaceOpt.makeShowToastOpt(`Signed out as ${user.email}`));
  }

  deleteAccount() {
    // TODO: Add a confirm button
    this.localStorageService.clearStorage();
    this.authService.deleteAccount();
  }
}
