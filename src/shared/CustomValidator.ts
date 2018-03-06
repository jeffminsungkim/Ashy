import { AbstractControl, ValidatorFn } from '@angular/forms';
export class CustomValidator {
  static patternInspector(regexp: RegExp): ValidatorFn {
    return (control: AbstractControl) : { [key: string]: any } => {
      const value = control.value;

      if (value === '') return null;

      return !regexp.test(value) ? { 'patternInvalid': { regexp } } : null;
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
}
