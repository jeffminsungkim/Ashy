import { Component } from '@angular/core';
import { IonicPage, NavParams, ModalController, ViewController } from 'ionic-angular';
import { User } from '@ashy/models/user';


@IonicPage()
@Component({
  selector: 'page-setting-group',
  templateUrl: 'setting-group.html',
})
export class SettingGroupPage {
  user: User;
  identicon: string;

  constructor(
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController) {
    this.user = navParams.get('user');
    this.identicon = navParams.get('identicon');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingGroupPage');
  }

  changeDisplayName() {
    this.modalCtrl.create('DisplaynamePage', { showCloseBtn: true, displayName: this.user.displayName }).present();
    this.dismissModal();
  }

  changeStatusMessage() {
    this.modalCtrl.create('StatusMessagePage', { showCloseBtn: true }).present();
    this.dismissModal();
  }

  changeUsername() {
    this.modalCtrl.create('UsernamePage', { user: this.user, showCloseBtn: true }).present();
    this.dismissModal();
  }

  goToSetting() {
    this.modalCtrl.create('SettingPage', { user: this.user, identicon: this.identicon }).present();
    this.dismissModal();
  }

  dismissModal() { this.viewCtrl.dismiss(); }

}
