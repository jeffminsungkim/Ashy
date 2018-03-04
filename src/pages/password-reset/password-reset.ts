import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthServiceProvider } from '@ashy/services/auth-service/auth-service';
import { InterfaceOption } from '@ashy/services/interface-option/interface-option';


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
    public alertCtrl: AlertController,
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
      validator: PasswordValidation.passwordInspector(this.currentPassword)
    })
  }

  get newPassword() {
    return this.passwordGroup.get('newPassword');
  }

  get confirmPassword() {
    return this.passwordGroup.get('confirmPassword');
  }
}

export class PasswordValidation {
  static passwordInspector(currentPassword: string) {
    return (abstractCtrl: AbstractControl) => {
      let password = abstractCtrl.get('newPassword').value;
      let confirmPassword = abstractCtrl.get('confirmPassword').value;

      if (password !== confirmPassword) {
        console.log('Password does not matched');
        return {invalid: true};
      } else if (currentPassword === password) {
        console.log('New password matched with an old password');
        return {invalid: true};
      } else {
        console.log('Good!');
        return null;
      }
    }
  }

}
