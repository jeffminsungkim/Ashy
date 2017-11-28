import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ToastServiceProvider } from '../../providers/toast-service/toast-service';
import { LoadingServiceProvider } from '../../providers/loading-service/loading-service';
import { ModalServiceProvider } from '../../providers/modal-service/modal-service';
import { ErrorDetectionServiceProvider } from '../../providers/error-detection-service/error-detection-service';

import { User } from '../../models/user';


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  user: User = {
    email: '',
    password: '',
    displayName: '',
    gender: ''
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthServiceProvider,
    private toastService: ToastServiceProvider,
    private loadingService: LoadingServiceProvider,
    private modalService: ModalServiceProvider,
    private errorDetectionService: ErrorDetectionServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  async onSubmit({value, valid}: {value: User, valid: boolean}) {
    console.log("register value", value);
    if (!valid) {
      this.toastService.allFieldsRequired();
    } else {
      this.loadingService.showWaitLoader();
      try {
        const res: any = await this.authService.emailSignUp(value);
        console.log("Register onSubmit data:", res);
        if (res) {
          this.toastService.show(res.message);
          this.modalService.showProfileModal();
          this.navCtrl.setRoot('LoginPage');
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
