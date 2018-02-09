import { Component, ViewChild } from '@angular/core';

import { AlertServiceProvider } from "@ashy/services/alert-service/alert-service";
import { AuthServiceProvider } from "@ashy/services/auth-service/auth-service";
import { LoadingServiceProvider } from "@ashy/services/loading-service/loading-service";
import { ToastServiceProvider } from '@ashy/services/toast-service/toast-service';
import { ErrorDetectionServiceProvider } from "@ashy/services/error-detection-service/error-detection-service";

import { EmailSignup } from "@ashy/models/emailsignup";

@Component({
  selector: 'registration-form',
  templateUrl: 'registration-form.html'
})
export class RegistrationFormComponent {

  @ViewChild('emailInput') emailInput;
  public submitLabel: string;
  public functionName: string;
  public user = {} as EmailSignup;

  constructor(
    public alertService: AlertServiceProvider,
    public authService: AuthServiceProvider,
    public loadingService: LoadingServiceProvider,
    public toastService: ToastServiceProvider,
    public errorDetectionService: ErrorDetectionServiceProvider) {}

  public handleDynamicSubmitFunc(funcName: string) { this.functionName = funcName; }

  public changeSumitButtonLabelTo(text: string) { this.submitLabel = text; }

  async login() {
    this.loadingService.showWaitLoader();
    try {
      const res = await this.authService.emailLogin(this.user);

      if (res) this.loadingService.dismiss();
    } catch (err) {
      this.alertService.notifyErrorMessage(err.message);
      this.loadingService.dismiss();
    }
  }

  async signup() {
    this.loadingService.showWaitLoader();
    try {
      const res: any = await this.authService.emailSignUp(this.user);

      if (res) {
        this.toastService.show(res.message);
        this.alertService.notifyToCheckVerificationEmail();
        this.loadingService.dismiss();
      }
    } catch (error) {
      console.error(error);
      this.loadingService.dismiss();
      let errorMessage = this.errorDetectionService.inspectAnyErrors(error.code);
      this.toastService.show(errorMessage);
    }
  }
}
