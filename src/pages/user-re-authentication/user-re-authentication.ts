import { Component, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { AuthServiceProvider } from '@ashy/services/auth-service/auth-service';
import { LocalStorageServiceProvider } from '@ashy/services/local-storage-service/local-storage-service';
import { UserServiceProvider } from '@ashy/services/user-service/user-service';
import { UtilityServiceProvider } from '@ashy/services/utility-service/utility-service';


@IonicPage()
@Component({
  selector: 'page-user-re-authentication',
  templateUrl: 'user-re-authentication.html',
})
export class UserReAuthenticationPage {
  @ViewChild('inputBox') inputBox;
  title: string;
  infoMessage: string;
  emailOrPasswd: string;
  currentEmail: string;
  hash: string;
  passwordControl: FormControl;
  formError: string;
  incorrectPasswd: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private events: Events,
    private authService: AuthServiceProvider,
    private localStorage: LocalStorageServiceProvider,
    private userService: UserServiceProvider,
    private utilityService: UtilityServiceProvider) {

    this.currentEmail = navParams.get('currentEmail');
    console.log('authentication, currentEmail:', this.currentEmail);
    this.title = navParams.get('credential');
    this.emailOrPasswd = this.title.toLowerCase();
    this.createSingleForm();
  }

  ionViewWillEnter() {
    this.setInfoMessage();
    this.clearInputBox();
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.inputBox.setFocus();
    }, 600);
  }

  saveIdenticonHash(hash: string) { this.localStorage.storeIdenticonHash(hash); }

  removeInvalidIdenticonHash() { this.localStorage.removeStorageItem('identicon_hash'); }

  convertEmailToIdenticonHash(email: string) { return this.utilityService.convertEmailToHash(email); }

  clearInputBox() { this.passwordControl.reset(); }

  createSingleForm() { this.passwordControl = new FormControl('', [Validators.required, Validators.minLength(7)]); }

  touchClearkey() { if (this.passwordControl.value === '') this.clearFormError(); }

  clearFormError() {
    this.formError = null;
    this.incorrectPasswd = false;
    this.clearInputBox();
    this.inputBox.setFocus();
  }

  setIncorrectPasswordError() {
    this.formError = 'form-error';
    this.incorrectPasswd = true;
  }

  setInfoMessage() {
    if (this.title === 'Password')
      this.infoMessage = `To set a new ${this.emailOrPasswd}, please enter your current password first.`;
    else
      this.infoMessage = 'For your security, please enter your password.';
  }

  backToPreviousPage() {
    this.navCtrl.pop().then(() => {
      this.publishEvents(this.emailOrPasswd, this.currentEmail);
      this.publishEvents('new:identiconHash', this.hash);
    });
  }

  private publishEvents(topic: string, eventData: any) {
    this.events.publish(topic, eventData);
  }

  adjustIdenticonHash() {
    this.removeInvalidIdenticonHash();
    this.hash = this.convertEmailToIdenticonHash(this.currentEmail);
    this.saveIdenticonHash(this.hash);
  }

  changePassword({ value, valid }: { value: string, valid: boolean }) {
    if (valid) this.reAuthenticateWithCredential(value);
  }

  reAuthenticateWithCredential(password: string) {
    this.authService.reAuthenticate(password).then(() => {
      if (this.emailOrPasswd === 'email') {
        this.authService.updateEmailAddress(this.currentEmail).then(() => {
          this.adjustIdenticonHash();
          this.userService.updateUserEmailAddress(this.currentEmail).then(() => {
            this.backToPreviousPage();
          });
        }).catch((err) => console.log('Sending verification link fail', err));
      }
      else {
        this.navCtrl.push('PasswordResetPage', { currentPassword: password });
      }
    })
    .catch((err) => {
      this.setIncorrectPasswordError();
    });
  }
}
