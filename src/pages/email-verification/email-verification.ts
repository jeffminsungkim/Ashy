import { Component } from '@angular/core';
import { IonicPage, AlertController, ToastController, ModalController, Toast } from 'ionic-angular';
import { AuthServiceProvider } from '@ashy/services/auth-service/auth-service';
import { InterfaceOption } from '@ashy/services/interface-option//interface-option';
import { UserServiceProvider } from '@ashy/services/user-service/user-service';
import { LocalStorageServiceProvider } from '@ashy/services/local-storage-service/local-storage-service';


@IonicPage()
@Component({
  selector: 'page-email-verification',
  templateUrl: 'email-verification.html',
})
export class EmailVerificationPage {

  private email: string;
  private intervalId: number;

  constructor(
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    private authService: AuthServiceProvider,
    private interfaceOpt: InterfaceOption,
    private userService: UserServiceProvider,
    private localStorageService: LocalStorageServiceProvider) { }

  ionViewDidLoad() {
    this.email = this.userService.currentUserEmail;
  }

  goToMyEmail() {
    let erModal = this.modalCtrl.create('EmailPage', { currentEmail: this.email, showCloseBtn: true });
    erModal.onDidDismiss(data => this.email = data.email);
    erModal.present();
  }

  reSendVerificationLink() {
    this.authService.sendEmailVerification().then(() => {
      this.alertCtrl.create(this.interfaceOpt.makeEmailVerificationOpt()).present();
    });
  }

  async logout() {
    this.localStorageService.clearStorage();
    this.userService.updateCurrentUserActiveStatusTo('signout');
    this.userService.updateCurrentUserAppUsageStatusTo(false, 'signout');
    const user: any = await this.authService.signOut();
    this.toastCtrl.create(this.interfaceOpt.makeShowToastOpt(`Signed out as ${user.email}`)).present();
  }

}
