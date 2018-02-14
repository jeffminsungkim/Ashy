import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-setting-group',
  templateUrl: 'setting-group.html',
})
export class SettingGroupPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
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
    console.log('go to setting page');
  }

  dismissModal() {
    this.viewCtrl.dismiss();
  }

}
