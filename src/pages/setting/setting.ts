import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/take';

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
export class SettingPage implements OnDestroy {
  private subscription: Subscription;
  private username: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthServiceProvider,
    private userService: UserServiceProvider,
    private toastService: ToastServiceProvider,
    private modalService: ModalServiceProvider,
    private uploadService: UploadServiceProvider) { }

 
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
    this.userService.updateCurrentActiveStatusTo(false);
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