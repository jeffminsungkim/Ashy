import { Component, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, Events, ViewController } from 'ionic-angular';
import { CustomValidator } from '@ashy/shared/customvalidator';
import { SingleEmailFormComponent } from '@ashy/components/single-email-form/single-email-form';
import { AuthServiceProvider } from '@ashy/services/auth-service/auth-service';


@IonicPage()
@Component({
  selector: 'page-email',
  templateUrl: 'email.html',
})
export class EmailPage {
  @ViewChild(SingleEmailFormComponent) emailForm: SingleEmailFormComponent;
  public title: string;
  public labelName: string;
  public infoMessage: string;
  public warningMessage: string;
  public verifiedMessage: string;
  public currentEmail: string;
  public pristineEmail:string;
  public newEmail: string;
  public formError: boolean;
  public verifiedState: boolean;
  public showCloseBtn: boolean;
  public emailControl: FormControl;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private events: Events,
    private viewCtrl: ViewController,
    private authService: AuthServiceProvider) {
    this.showCloseBtn = navParams.get('showCloseBtn');
    this.pristineEmail = navParams.get('currentEmail');
    this.title = 'Email';
    this.labelName = 'Continue';
    this.infoMessage = 'You can use this email address to log in, or for password recovery.';
    this.warningMessage = `By verifying a new email address ${this.pristineEmail} will no longer be associated with your account.`;
    this.currentEmail = this.pristineEmail;
  }

  ionViewWillEnter() {
    this.checkEmailVerificationState();
    this.subscribeUpdatedEmail();
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.emailForm.emailInput.setFocus();
    }, 600);
  }

  ionViewWillLeave() {
    if (this.pristineEmail !== this.currentEmail && this.showCloseBtn) this.events.publish(this.title.toLowerCase(), this.currentEmail);
  }

  checkEmailVerificationState() {
    this.verifiedState = this.navParams.get('emailVerified');
    if (this.verifiedState) {
      this.verifiedMessage = 'Your email address is verified';
    } else {
      this.infoMessage = "We've sent a verification email to you. Please open the link to finish verifying your address.";
    }
  }

  private subscribeUpdatedEmail() {
    this.events.subscribe('email', (email) => {
      if (email) {
        this.pristineEmail = email;
        this.currentEmail = email;
        this.unsubscribeEvent();
      }
    });
  }

  private unsubscribeEvent() {
    this.events.unsubscribe('email');
    console.log('unsubscribed email event');
  }

  authenticateCredential($event) {
    if ($event.valid) this.navCtrl.push('UserReAuthenticationPage', { credential: 'Email', currentEmail: $event.value });
  }

  sendVerificationLink($event) {
    this.authService.sendEmailVerification().then(() => {
      console.log('Verification link has been sent to', $event);
    });
  }

  closeModal() { this.viewCtrl.dismiss({ email: this.pristineEmail }); }

}
