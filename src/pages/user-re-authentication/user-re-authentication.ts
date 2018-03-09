import { Component, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, Events, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '@ashy/services/auth-service/auth-service';
import { InterfaceOption } from '@ashy/services/interface-option/interface-option';
import { LocalStorageServiceProvider } from '@ashy/services/local-storage-service/local-storage-service';
import { UserServiceProvider } from '@ashy/services/user-service/user-service';
import { UtilityServiceProvider } from '@ashy/services/utility-service/utility-service';


@IonicPage()
@Component({
  selector: 'page-user-re-authentication',
  templateUrl: 'user-re-authentication.html',
})
export class UserReAuthenticationPage {
  @ViewChild('inputBox') passwordInput;
  passwordControl: FormControl;
  title: string;
  infoMessage: string;
  emailOrPasswd: string;
  currentEmail: string;
  hash: string;
  formError: string;
  incorrectPasswd: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private events: Events,
    private authService: AuthServiceProvider,
    private interfaceOpt: InterfaceOption,
    private localStorage: LocalStorageServiceProvider,
    private userService: UserServiceProvider,
    private utilityService: UtilityServiceProvider) {

    this.currentEmail = navParams.get('currentEmail');
    this.title = navParams.get('credential');
    this.emailOrPasswd = this.title.toLowerCase();
    this.incorrectPasswd = false;
  }

  ionViewWillEnter() {
    this.setInfoMessage();
    this.clearPasswordForm();
  }

  ionViewWillLoad() { this.createPasswordForm(); }

  saveIdenticonHash(hash: string) { this.localStorage.storeIdenticonHash(hash); }

  removeInvalidIdenticonHash() { this.localStorage.removeStorageItem('identicon_hash'); }

  convertEmailToIdenticonHash(email: string) { return this.utilityService.convertEmailToHash(email); }

  clearPasswordForm() { this.newPassword.reset(); }

  touchClearkey() { if (this.newPassword.value === '') this.clearFormError(); }

  createPasswordForm() { this.passwordControl = new FormControl('', [Validators.required, Validators.minLength(7)]); }

  get newPassword() { return this.passwordControl; }

  clearFormError() {
    this.formError = null;
    this.incorrectPasswd = false;
    this.clearPasswordForm();
    this.passwordInput.setFocus();
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

    // TODO: Write a method to update identicon image to storage
  }

  changePassword({ value, valid }: { value: string, valid: boolean }) {
    if (valid) this.reAuthenticateWithCredential(value);
  }

  reAuthenticateWithCredential(password: string) {
    let loader = this.loadingCtrl.create(this.interfaceOpt.makeWaitLoaderOpt());
    loader.present();
    this.authService.reAuthenticate(password).then(() => {
      if (this.emailOrPasswd === 'email') {
        this.authService.updateEmailAddress(this.currentEmail).then(() => {
          this.adjustIdenticonHash();
          this.userService.updateUserEmailAddress(this.currentEmail).then(() => {
            // TODO: Write a method to update identicon image to storage
            loader.dismiss();
            this.backToPreviousPage();
          });
        }).catch((err) => {
          loader.dismiss();
          console.log('Sending verification link fail', err);
        });
      }
      else {
        loader.dismiss();
        this.navCtrl.push('PasswordResetPage', { currentPassword: password });
      }
    })
    .catch((err) => {
      loader.dismiss();
      this.setIncorrectPasswordError();
    });
  }
}
