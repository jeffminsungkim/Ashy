import { Component, ViewChild } from '@angular/core';
import { LowerCasePipe } from '@angular/common';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { FormControl, Validators } from '@angular/forms';
import { CustomValidator } from '@ashy/shared/custom-validator';
import { ValidationServiceProvider } from '@ashy/services/validation-service/validation-service';


@IonicPage()
@Component({
  selector: 'page-username',
  templateUrl: 'username.html',
})
export class UsernamePage {
  @ViewChild('inputBox') searchInput;
  usernameControl: FormControl;
  unNotice: string;
  dnNotice: string;
  username: string;
  displayName: string;
  showCloseBtn: boolean;
  formValid: boolean;

  constructor(
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public validationService: ValidationServiceProvider) {

    this.formValid = false;
    this.showCloseBtn = navParams.get('showCloseBtn');
    this.username = navParams.get('username');
    this.displayName = navParams.get('displayName');
    this.unNotice = `${this.username} is your username`;
    this.dnNotice = `${this.displayName} is how you appear on Ashy`;
  }

  ionViewWillLoad() { this.createUsernameForm(); }

  ionViewDidLoad() {
    setTimeout(() => {
      this.searchInput.setFocus();
    }, 600);
  }

  get newUsername() { return this.usernameControl; }

  initInputForm() { this.newUsername.reset(); }

  clearSearchForm() { this.initInputForm(); }

  createUsernameForm() {
    const username = /^[a-zA-Z]+[a-zA-Z0-9]*$/;
    this.usernameControl = new FormControl('',
    {
      validators: [Validators.required, Validators.minLength(4), CustomValidator.inspectPattern(username)],
      asyncValidators: CustomValidator.checkUsernameAvailability(this.validationService)
    });
  }

  dismissModal() { this.viewCtrl.dismiss(); }
}
