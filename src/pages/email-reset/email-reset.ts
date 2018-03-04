import { Component } from '@angular/core';
import { IonicPage, NavParams, AlertController, ViewController, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '@ashy/services/auth-service/auth-service';
import { InterfaceOption } from '@ashy/services/interface-option/interface-option';


@IonicPage()
@Component({
  selector: 'page-email-reset',
  templateUrl: 'email-reset.html',
})
export class EmailResetPage {

  public oldEmail: string;
  public newEmail: string;
  public showCloseBtn: boolean;

  constructor(
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    private authService: AuthServiceProvider,
    private interfaceOpt: InterfaceOption) {

    this.showCloseBtn = navParams.get('showCloseBtn');
    this.oldEmail = navParams.get('currentEmail');
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
      this.toastCtrl.create(this.interfaceOpt.makeShowToastOpt(`Address changed to ${newEmail}`)).present();
      this.viewCtrl.dismiss({'email': this.newEmail});
    } catch(error) {
      this.toastCtrl.create(this.interfaceOpt.makeShowToastOpt(error.message)).present();
    }
  }
}
