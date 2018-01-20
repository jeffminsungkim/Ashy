import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { AuthServiceProvider } from '@ashy-services/auth-service/auth-service';
import { ToastServiceProvider } from '@ashy-services/toast-service/toast-service';
import { ErrorDetectionServiceProvider } from '../../providers/error-detection-service/error-detection-service';


@IonicPage()
@Component({
  selector: 'page-email-reset',
  templateUrl: 'email-reset.html',
})
export class EmailResetPage {

  public oldEmail: string;
  public newEmail: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    private authService: AuthServiceProvider,
    private toastService: ToastServiceProvider,
    private errorDetectionService: ErrorDetectionServiceProvider) {

      this.oldEmail = this.navParams.get('oldEmail');
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EmailResetPage');
  }
  confirmUpdate() {
    this.confirmUpdateEmailAddress(this.newEmail);
  }

  closeModal() {
    this.viewCtrl.dismiss({'email': this.oldEmail});
  }

  confirmUpdateEmailAddress(newEmail: string) {
    this.alertCtrl.create({
      title: newEmail,
      message: 'Are you sure this is the correct address you want to change?',
      cssClass:'alert-buttons',
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'cancel-button',
          role: 'cancel'
        },
        {
          text: 'Change',
          cssClass: 'change-button',
          handler: _ => {
            this.updateEmailAddress(newEmail);
          }
        }
      ]
    }).present();
  }

  async updateEmailAddress(newEmail: string) {
    try {
      await this.authService.updateEmailAddress(newEmail);
      this.toastService.show(`Address changed to ${newEmail}`);
      this.viewCtrl.dismiss({'email': this.newEmail});
    } catch(error) {
      let errorMessage = this.errorDetectionService.inspectAnyErrors(error.code);
      this.toastService.show(errorMessage);
    }
  }
}
