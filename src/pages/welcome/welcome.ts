import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  goToRegisterPage() {
    this.navCtrl.push('RegisterPage');
  }

  goToLoginPage() {
    this.navCtrl.push('LoginPage');
  }

}
