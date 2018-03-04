import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ActionSheetController, ViewController } from 'ionic-angular';

import { ModalWrapperPage } from '@ashy/pages/modal-wrapper/modal-wrapper';
import { UserServiceProvider } from '@ashy/services/user-service/user-service';

import { User } from '@ashy/models/user';


@IonicPage()
@Component({
  selector: 'page-profile-detail',
  templateUrl: 'profile-detail.html',
})
export class ProfileDetailPage {
  user: User;
  pickedGender: boolean;
  hideUsername: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private events: Events,
    public modalWrapper: ModalWrapperPage,
    public viewCtrl: ViewController,
    public userService: UserServiceProvider) {

    this.pickedGender = false;
    this.hideUsername = false;
    this.user = this.modalWrapper.modalParams;
  }

  goToEditDisplayname() {
    this.subscribeEvent('displayName', this.user);
    this.navCtrl.push('DisplaynamePage', { showCloseBtn: false, displayName: this.user.displayName });
  }

  goToEditStatusMessage() {
    this.subscribeEvent('statusMessage', this.user);
    this.navCtrl.push('StatusMessagePage', { showCloseBtn: false });
  }

  goToEditUsername() {
    this.navCtrl.push('UsernamePage');
  }

  goToChangeEmail() {
    this.navCtrl.push('EmailResetPage', { currentEmail: this.user.email, showCloseBtn: false });
  }

  goToChangePassword() {

  }

  hideMyUsername(event: any) {
    console.log('Hide my username', event.checked);
  }

  chooseGender(gender: string) {
    this.pickedGender = true;
    console.log('Choose gender!', gender);
  }

  private subscribeEvent(topic: string, user: User) {
    this.events.subscribe(topic, (eventData) => {
      console.log('eventData:', eventData);
      user[topic] = eventData;
      this.unsubscribeEvent(topic);
    });
  }

  private unsubscribeEvent(topic: string) {
    this.events.unsubscribe(topic);
    console.log('unsubscribed event');
  }

  dismissModal() { this.modalWrapper.dismissModal(); }
}
