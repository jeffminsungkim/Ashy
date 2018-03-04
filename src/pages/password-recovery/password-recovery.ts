import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthServiceProvider } from '@ashy/services/auth-service/auth-service';
import { InterfaceOption } from '@ashy/services/interface-option/interface-option';

@IonicPage()
@Component({
  selector: 'page-password-recovery',
  templateUrl: 'password-recovery.html',
})
export class PasswordRecoveryPage {
  email: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private interfaceOpt: InterfaceOption,
    private authService: AuthServiceProvider) { }

  ionViewDidLoad() {

  }

  sendEmail() {
    this.alertCtrl.create({
      title: this.email,
      message: 'Please confirm the verification link from your email account.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Send',
          handler: () => {
            this.sendPasswrodResetEmail();
          }
        }
      ]
    }).present();
  }

  async sendPasswrodResetEmail() {
    console.log('sendPasswrodResetEmail() called');
    try {
      const res: any = await this.authService.resetPassword(this.email);

      if (res.status)
        this.alertCtrl.create(this.interfaceOpt.makePasswordResetOpt()).present();
    } catch(error) {
      console.log("error:", error);
      this.alertCtrl.create(this.interfaceOpt.makeErrorMessageOpt(error.message)).present();
    }
  }

}
