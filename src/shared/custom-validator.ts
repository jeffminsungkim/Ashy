import { AbstractControl, ValidatorFn, AsyncValidatorFn  } from '@angular/forms';
import { ValidationServiceProvider } from '@ashy/services/validation-service/validation-service';


export class CustomValidator {

  static inspectPattern(regexp: RegExp): ValidatorFn {
    return (control: AbstractControl) : { [key: string]: any } => {
      const value = control.value;

      if (value === '') return null;

      return !regexp.test(value) ? { patternInvalid: { regexp } } : null;
    }
  }

  static inspectPassword(currentPassword: string): ValidatorFn {
    return (control: AbstractControl) => {
      const password = control.get('newPassword').value;
      const confirmPassword = control.get('confirmPassword').value;

      if (password !== confirmPassword) {
        console.log('Password does not matched');
        return { passwordInvalid: true};
      } else if (currentPassword === password) {
        console.log('New password matched with an old password');
        return { passwordInvalid: true};
      } else {
        console.log('Good!');
        return null;
      }
    }
  }

  static checkEmailAvailability(validationService: ValidationServiceProvider): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const email = control.value.toLowerCase();
      return validationService.isEmailAvailableOrNot(email);
    }
  }

  static checkUsernameAvailability(validationService: ValidationServiceProvider): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const username = control.value.toLowerCase();
      return validationService.isUsernameAvailableOrNot(username);
    }
  }
}
