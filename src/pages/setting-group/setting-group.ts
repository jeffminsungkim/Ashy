import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { User } from '@ashy/models/user';


@IonicPage()
@Component({
  selector: 'page-setting-group',
  templateUrl: 'setting-group.html',
})
export class SettingGroupPage {
  user: User;
  identicon: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public viewCtrl: ViewController) {
    this.user = this.navParams.get('user');
    this.identicon = this.navParams.get('identicon');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingGroupPage');
  }

  changeDisplayName() {
    console.log('go to change display name page');
  }

  changeStatusMessage() {
    console.log('go to change status message page');
  }

  changeUsername() {
    console.log('go to change username page');
  }

  goToSetting() {
    this.modalCtrl.create('SettingPage', { user: this.user, identicon: this.identicon }).present();
    this.dismissModal();
  }

  dismissModal() {
    this.viewCtrl.dismiss();
  }

}
