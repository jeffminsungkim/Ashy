import { Component, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { CustomValidator } from '@ashy/shared/custom-validator';
import { ModalWrapperPage } from '@ashy/pages/modal-wrapper/modal-wrapper';
import { AuthServiceProvider } from '@ashy/services/auth-service/auth-service';
import { ValidationServiceProvider } from '@ashy/services/validation-service/validation-service';


@IonicPage()
@Component({
  selector: 'page-email',
  templateUrl: 'email.html',
})
export class EmailPage {
  @ViewChild('inputBox') emailInput;
  emailControl: FormControl;
  title: string;
  labelName: string;
  infoMessage: string;
  warningMessage: string;
  verifiedMessage: string;
  currentEmail: string;
  pristineEmail:string;
  verifiedState: boolean;
  showCloseBtn: boolean;

  constructor(
    public navCtrl: NavController,
    private events: Events,
    private modalWrapper: ModalWrapperPage,
    private authService: AuthServiceProvider,
    private validationService: ValidationServiceProvider) {

    this.showCloseBtn = this.modalWrapper.modalParams.showCloseBtn;
    this.pristineEmail = this.authService.currentUserEmail;
    this.title = 'Email';
    this.labelName = 'Continue';
    this.infoMessage = 'You can use this email address to log in, or for password recovery.';
    this.noteWarningMessage(this.pristineEmail);
    this.currentEmail = this.pristineEmail;
  }

  ionViewWillEnter() {
    this.checkEmailVerificationState();
    this.subscribeUpdatedEmail();
  }

  ionViewWillLoad() { this.createEmailForm(); }

  get newEmail() { return this.emailControl; }

  createEmailForm() {
    const email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.emailControl = new FormControl(this.pristineEmail,
    {
      validators: [Validators.required, CustomValidator.inspectPattern(email)],
      asyncValidators: CustomValidator.checkEmailAvailability(this.validationService)
    });
  }

  clearFormError() {
    this.newEmail.setValue(this.pristineEmail);
    this.emailInput.setFocus();
  }

  noteWarningMessage(email: string) {
    this.warningMessage = `By verifying a new email address ${email} will no longer be associated with your account.`;
  }

  checkEmailVerificationState() {
    this.verifiedState = this.authService.currentUserEmailVerified;
    if (this.verifiedState) this.verifiedMessage = 'Your email address is verified';
    else this.infoMessage = "We've sent a verification email to you. Please open the link to finish verifying your address.";
  }

  private subscribeUpdatedEmail() {
    this.events.subscribe('email', (email) => {
      if (email) {
        this.sendVerificationLink(email);
        this.noteWarningMessage(email);
        this.pristineEmail = email;
        this.currentEmail = email;
      }
    });
  }

  renderClass() {
    if (this.newEmail.value === this.pristineEmail) return;
    switch(this.newEmail.status){
      case "INVALID":
        return "notification is-danger"
      case "VALID":
        return "notification is-success"
      case "PENDING":
        return "notification is-info"
      default:
        break;
    }
  }

  authenticateCredential($event) {
    if ($event.valid) this.navCtrl.push('UserReAuthenticationPage', { credential: 'Email', currentEmail: $event.value });
  }

  sendVerificationLink($event) {
    this.authService.sendEmailVerification().then(() => console.log('Verification link has been sent to', $event));
  }

  dismissModal() { this.modalWrapper.dismissModal({ email: this.pristineEmail }); }
}
