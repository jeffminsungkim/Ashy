import { Component } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { ModalWrapperPage } from '@ashy/pages/modal-wrapper/modal-wrapper';
import { UserServiceProvider } from '@ashy/services/user-service/user-service';
import { User } from '@ashy/models/user';
import { Username } from '@ashy/models/username';
import { Observable } from 'rxjs/Observable';


@IonicPage()
@Component({
  selector: 'page-profile-detail',
  templateUrl: 'profile-detail.html',
})
export class ProfileDetailPage {
  usernamesRef$: Observable<Username>;
  user: User;
  gender: string;
  pickedGender: boolean;
  emailVerified: boolean;

  constructor(
    public navCtrl: NavController,
    private events: Events,
    private modalWrapper: ModalWrapperPage,
    public userService: UserServiceProvider) {

    this.pickedGender = false;
    this.user = this.modalWrapper.modalParams.user;
  }

  ionViewWillEnter() {
    this.getUsernameVisibility();
    this.checkEmailVerifiedState();
    console.log('Your account emailVerified:', this.emailVerified);
  }

  ionViewWillUnload() { this.unsubscribeEvent('email'); }

  getUsernameVisibility() { this.usernamesRef$ = this.userService.getUsernameVisibility(); }

  checkEmailVerifiedState() {
    this.userService.currentUserEmailVerified ? this.emailVerified = true : this.emailVerified = false;
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
    this.navCtrl.push('UsernamePage', { showCloseBtn: false, displayName: this.user.displayName, username: this.user.username });
  }

  goToUserEmail() {
    this.subscribeEvent('email', this.user);
    this.navCtrl.push('EmailPage', { showCloseBtn: false });
  }

  goToChangePassword() { this.navCtrl.push('UserReAuthenticationPage', { credential: 'Password' }); }

  changeUsernameVisibility(visibility: boolean) { this.userService.updateUsernameVisibility(visibility); }

  chooseGender(gender: string) {
    this.gender = gender;
    this.pickedGender = true;
    this.userService.updateGender(this.gender);
  }

  private subscribeEvent(topic: string, user: User) {
    this.events.subscribe(topic, (eventData) => {
      user[topic] = eventData;
      if (topic !== 'email') this.unsubscribeEvent(topic);
    });
  }

  private unsubscribeEvent(topic: string) {
    this.events.unsubscribe(topic);
    console.log(`Unsubscribe to ${topic}`);
  }

  dismissModal() { this.modalWrapper.dismissModal(this.gender); }
}
