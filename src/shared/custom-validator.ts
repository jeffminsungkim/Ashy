import { AbstractControl, ValidatorFn, AsyncValidatorFn  } from '@angular/forms';
import { UserServiceProvider } from '@ashy/services/user-service/user-service';


export class CustomValidator {

  static patternInspector(regexp: RegExp): ValidatorFn {
    return (control: AbstractControl) : { [key: string]: any } => {
      const value = control.value;

      if (value === '') return null;

      return !regexp.test(value) ? { patternInvalid: { regexp } } : null;
    }
  }

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

  static duplicateInspector(userService: UserServiceProvider) {
    return (control: AbstractControl) => {
      let email = control.value.toLowerCase();
      return userService.checkEmail(email);
    }
  }

  static usernameTester(userService: UserServiceProvider): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const username = control.value.toLowerCase();
      return userService.testUsername(username);
    }
  }
}
