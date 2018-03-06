import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CustomValidator } from '@ashy/shared/customvalidator';


@Component({
  selector: 'single-email-form',
  templateUrl: 'single-email-form.html'
})
export class SingleEmailFormComponent {
  @ViewChild('inputBox') emailInput;
  @Input('formControl') emailControl: FormControl;
  @Input('email') currentEmail: string;
  @Input('pristineEmail') pristineEmail: string;
  @Input('infoMsg') infoMessage: string;
  @Input('warningMsg') warningMessage: string;
  @Input('verifiedMsg') verifiedMessage: string;
  @Input('buttonLabel') labelName: string;
  @Input('verifiedState') verifiedState: boolean;
  @Output() onSubmit = new EventEmitter<any>();
  @Output() emailLink = new EventEmitter<any>();
  public formError: boolean;
  constructor() {
    this.createSingleForm();
  }

  authenticateCredential() {
    console.log('From parent component authenticateCredential');
    this.onSubmit.emit(this.emailControl);
  }

  sendVerificationLink() {
    console.log('From parent component sendVerificationLink()');
    this.emailLink.emit(this.currentEmail);
  }

  createSingleForm() {
    this.emailControl = new FormControl('',
    [
      Validators.required,
      CustomValidator.patternInspector(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    ]);
  }

  formValidator() {
    let emailPatternError = this.emailControl.hasError('patternInvalid');
    (emailPatternError || this.emailControl.value === '') ? this.setInvalidEmailError() : this.removeInvalidEmailError();
    console.log('Email Pattern is:', emailPatternError);
  }

  clearFormError() {
    this.emailControl.reset();
    this.emailInput.setFocus();
  }

  setInvalidEmailError() { this.formError = true; }

  removeInvalidEmailError() { this.formError = false; }

}
