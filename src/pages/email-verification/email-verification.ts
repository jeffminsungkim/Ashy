import { Upload } from './../../models/Upload';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertServiceProvider } from "@ashy-services/alert-service/alert-service";
import { AuthServiceProvider } from '@ashy-services/auth-service/auth-service';
import { ModalServiceProvider } from '@ashy-services/modal-service/modal-service';
import { UserServiceProvider } from '@ashy-services/user-service/user-service';
import { ToastServiceProvider } from '@ashy-services/toast-service/toast-service';


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
    private afAuth: AngularFireAuth,
    private alertService: AlertServiceProvider,
    private authService: AuthServiceProvider,
    private modalService: ModalServiceProvider,
    private userService: UserServiceProvider,
    private toastService: ToastServiceProvider) { }

  ionViewDidLoad() {
    this.email = this.userService.currentUserEmail;
    this.checkIsUserEmailVerifiedOrNot();
  }

  ionViewDidLeave() {
    clearInterval(this.intervalId);
  }

  checkIsUserEmailVerifiedOrNot() {
    if (this.userService.currentUserEmailVerified) {
      this.navCtrl.push('ProfilePresetPage');
      return;
    }
    this.afAuth.auth.onAuthStateChanged(user => {
      this.intervalId = setInterval(() => {
        this.afAuth.auth.currentUser.reload().then(() => {
          console.log('Verification State:', user.emailVerified);
          if (user.emailVerified) {
            clearInterval(this.intervalId);
            this.navCtrl.push('ProfilePresetPage');
          }
        });
      }, 2000);
    });
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
    this.alertService.notifyToCheckVerificationEmail();
  }

  async logout() {
    this.userService.updateCurrentUserActiveStatusTo('signout');
    this.userService.updateCurrentUserAppUsageStatusTo(false, 'signout');
    const user: any = await this.authService.signOut();
    this.toastService.show(`Signed out as ${user.email}`);
  }

}
