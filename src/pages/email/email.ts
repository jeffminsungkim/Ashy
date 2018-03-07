import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { ModalWrapperPage } from '@ashy/pages/modal-wrapper/modal-wrapper';
import { AuthServiceProvider } from '@ashy/services/auth-service/auth-service';


@IonicPage()
@Component({
  selector: 'page-email',
  templateUrl: 'email.html',
})
export class EmailPage {
  public title: string;
  public labelName: string;
  public infoMessage: string;
  public warningMessage: string;
  public verifiedMessage: string;
  public currentEmail: string;
  public pristineEmail:string;
  public verifiedState: boolean;
  public showCloseBtn: boolean;

  constructor(
    public navCtrl: NavController,
    private events: Events,
    private modalWrapper: ModalWrapperPage,
    private authService: AuthServiceProvider) {

    this.showCloseBtn = this.modalWrapper.modalParams.showCloseBtn;
    this.pristineEmail = this.authService.currentUserEmail;
    this.title = 'Email';
    this.labelName = 'Continue';
    this.infoMessage = 'You can use this email address to log in, or for password recovery.';
    this.noteWarningMessage(this.pristineEmail);
    this.currentEmail = this.pristineEmail;
  }

  ionViewWillEnter() {
    console.log('enter email page');
    this.checkEmailVerificationState();
    this.subscribeUpdatedEmail();
  }

  noteWarningMessage(email: string) {
    this.warningMessage = `By verifying a new email address ${email} will no longer be associated with your account.`;
  }

  checkEmailVerificationState() {
    this.verifiedState = this.authService.currentUserEmailVerified;
    if (this.verifiedState) {
      this.verifiedMessage = 'Your email address is verified';
    } else {
      this.infoMessage = "We've sent a verification email to you. Please open the link to finish verifying your address.";
    }
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

  authenticateCredential($event) {
    if ($event.valid) this.navCtrl.push('UserReAuthenticationPage', { credential: 'Email', currentEmail: $event.value });
  }

  sendVerificationLink($event) {
    this.authService.sendEmailVerification().then(() => {
      console.log('Verification link has been sent to', $event);
    });
  }

  dismissModal() { this.modalWrapper.dismissModal({ email: this.pristineEmail }); }
}
