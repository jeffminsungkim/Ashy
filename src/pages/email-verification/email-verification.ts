import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, Toast } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthServiceProvider } from '@ashy/services/auth-service/auth-service';
import { ModalServiceProvider } from '@ashy/services/modal-service/modal-service';
import { InterfaceOption } from '@ashy/services/interface-option//interface-option';
import { UserServiceProvider } from '@ashy/services/user-service/user-service';


@IonicPage()
@Component({
  selector: 'page-email-verification',
  templateUrl: 'email-verification.html',
})
export class EmailVerificationPage {

  private email: string;
  private intervalId: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private afAuth: AngularFireAuth,
    private authService: AuthServiceProvider,
    private interfaceOpt: InterfaceOption,
    private modalService: ModalServiceProvider,
    private userService: UserServiceProvider) { }

  ionViewDidLoad() {
    this.email = this.userService.currentUserEmail;
  }

  setNewEmailAddress() {
    let erModal = this.modalService.showEmailResetModal(this.email);
    erModal.onDidDismiss(data => {
      console.log(data);
      this.email = data.email;
    });
    erModal.present();
  }

  requestVerificationEmail() {
    this.authService.sendEmailVerification();
    this.alertCtrl.create(this.interfaceOpt.makeEmailVerificationOpt()).present();
  }

  async logout() {
    this.userService.updateCurrentUserActiveStatusTo('signout');
    this.userService.updateCurrentUserAppUsageStatusTo(false, 'signout');
    const user: any = await this.authService.signOut();
    this.toastCtrl.create(this.interfaceOpt.makeShowToastOpt(`Signed out as ${user.email}`)).present();
  }

}
