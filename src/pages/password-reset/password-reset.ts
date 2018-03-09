import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '@ashy/services/auth-service/auth-service';
import { InterfaceOption } from '@ashy/services/interface-option/interface-option';
import { CustomValidator } from '@ashy/shared/custom-validator';


@IonicPage()
@Component({
  selector: 'page-password-reset',
  templateUrl: 'password-reset.html',
})
export class PasswordResetPage {
  @ViewChild('inputBox') inputBox;
  title: string;
  infoMessage: string;
  currentPassword: string;
  passwordGroup: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder,
    private interfaceOpt: InterfaceOption,
    private authService: AuthServiceProvider) {
    this.title = 'New Password';
    this.infoMessage = 'Strong passwords use a combination of lowercase and uppercase letters, numbers and symbols.';
    this.currentPassword = navParams.get('currentPassword');
    this.createFormGroup();
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.inputBox.setFocus();
    }, 600);
  }

  createFormGroup() {
    this.passwordGroup = this.formBuilder.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validator: CustomValidator.inspectPassword(this.currentPassword)
    })
  }

  backToProfileDetail() { this.navCtrl.popToRoot(); }

  changePassword() {
    // TODO: Need to create a success page.
    const newPassword = this.passwordGroup.get('confirmPassword').value;
    let loader = this.loadingCtrl.create(this.interfaceOpt.makeWaitLoaderOpt());
    loader.present();
    this.authService.updatePassword(newPassword).then(() => {
      loader.dismiss();
      this.backToProfileDetail(); // Workaround method.
    }).catch((err) => {
      loader.dismiss();
      console.log('Updating password fail', err);
    });
  }

  get newPassword() {
    return this.passwordGroup.get('newPassword');
  }

  get confirmPassword() {
    return this.passwordGroup.get('confirmPassword');
  }
}

