import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { EmailSignup } from "@ashy/models/emailsignup";

@Component({
  selector: 'registration-form',
  templateUrl: 'registration-form.html'
})
export class RegistrationFormComponent {

  @ViewChild('emailInput') emailInput;
  @Input('heading') heading: string;
  @Input('buttonLabel') labelName: string;
  @Output() onSubmit = new EventEmitter<EmailSignup>();
  user = {} as EmailSignup;

  constructor() {}

  submit(){
    this.onSubmit.emit(this.user);
  }
}
