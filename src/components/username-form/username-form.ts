import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CustomValidator } from '@ashy/shared/custom-validator';
import { UserServiceProvider } from '@ashy/services/user-service/user-service';


@Component({
  selector: 'username-form',
  templateUrl: 'username-form.html'
})
export class UsernameFormComponent {
  @Input('formControl') usernameControl: FormControl;
  @Input('usernameNotice') unNotice: string;
  @Input('displayNameNotice') dnNotice: string;
  @Input('username') pristineUserName: string;
  @Input('newUserName') newUsername: string;
  @Output() onSubmit = new EventEmitter<any>();
  constructor(private userService: UserServiceProvider) {
    this.createSingleForm();
  }

  createSingleForm() {
    this.usernameControl = new FormControl('',
    [
      Validators.required,
    ]);
  }

  test() {
    console.log('From parent component test');
    this.onSubmit.emit(this.usernameControl);
  }

  findUserWithUsername() {
    // let usernameError = this.usernameControl.hasError();
    // console.log('Username has an error:', usernameError);
    this.test();
  }

}
