import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

import { AuthServiceProvider } from "@ashy-services/auth-service/auth-service";
import { ToastServiceProvider } from "@ashy-services/toast-service/toast-service";
import { AlertServiceProvider } from "@ashy-services/alert-service/alert-service";
import { LoadingServiceProvider } from "@ashy-services/loading-service/loading-service";
import { ErrorDetectionServiceProvider } from "@ashy-services/error-detection-service/error-detection-service";
import { EmailSignup } from "@ashy-models/emailsignup";

@IonicPage()
@Component({
  selector: "page-register",
  templateUrl: "register.html"
})
export class RegisterPage {

  @ViewChild('emailInput') emailInput;
  public user: EmailSignup = {
    email: "",
    password: "",
    displayName: ""
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthServiceProvider,
    public toastService: ToastServiceProvider,
    public alertService: AlertServiceProvider,
    public loadingService: LoadingServiceProvider,
    public errorDetectionService: ErrorDetectionServiceProvider
  ) {}

  ionViewDidEnter() {
    setTimeout(() => {
      this.emailInput.setFocus();
    }, 500);
  }

  preventBlur(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  async onSubmit({ value, valid }: { value: EmailSignup; valid: boolean }) {
    if (!valid) {
      this.toastService.allFieldsRequired();
    } else {
      this.loadingService.showWaitLoader();
      try {
        const res: any = await this.authService.emailSignUp(value);

        if (res) {
          this.toastService.show(res.message);
          this.alertService.notifyToCheckVerificationEmail();
        }
      } catch (error) {
        console.error(error);
        this.loadingService.dismiss();
        let errorMessage = this.errorDetectionService.inspectAnyErrors(error.code);
        this.toastService.show(errorMessage);
      }
    }
  }

  backToRoot() {
    this.navCtrl.pop();
  }
}
