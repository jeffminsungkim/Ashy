import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthServiceProvider } from '@ashy-services/auth-service/auth-service';
import { UserServiceProvider } from '@ashy-services/user-service/user-service';
import { ToastServiceProvider } from '@ashy-services/toast-service/toast-service';
import { ModalServiceProvider } from '@ashy-services/modal-service/modal-service';
import { UploadServiceProvider } from '@ashy-services/upload-service/upload-service';

import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/take';


@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage implements OnDestroy {
  subscription: Subscription;
  username: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthServiceProvider,
    public userService: UserServiceProvider,
    public toastService: ToastServiceProvider,
    public modalService: ModalServiceProvider,
    public uploadService: UploadServiceProvider) { }

 
  ionViewWillEnter() {
    this.subscription = this.userService.getCurrentUsername().subscribe((user: any) => {
      console.log("SettingPage user", user);
      this.username = user;
    });
  }

  ngOnDestroy() {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
      console.log("Setting ngOnDestroy");
    }
  }

  // ionViewWillUnload() {
  //   // console.log('Runs when the page is about to leave and no longer be the active page.');
  //   this.subscription.unsubscribe();
  // }


  goToProfileDetail() {
    this.modalService.showProfileDetailModal();
  }

  async logout() {
    this.userService.updateCurrentUserActiveStatusTo('signout');
    const user: any = await this.authService.signOut();
    this.toastService.show(`Signed out as ${user.email}`);
  }

  deleteAccount() {
    // TODO: DELETE ACCOUNT FROM THE FOLLOWING CONDITION:
    // USER SHOULD TYPE THEIR EMAIL ACCOUNT IN TEXT INPUT
    // AND INPUT STRING MUST MATCH WITH THE USER'S EMAIL ACCOUNT.
    this.userService.removeDeprecatedUsername(this.username);
    this.uploadService.deleteFileNode();
    this.uploadService.deleteFileStorage();
    this.userService.deleteLoggedInUser();
    this.authService.deleteAccount();
  }
}