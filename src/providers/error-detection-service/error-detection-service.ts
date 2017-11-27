import { Injectable } from '@angular/core';

@Injectable()
export class ErrorDetectionServiceProvider {

  constructor() {

  }

  inspectAnyErrors(errorCode: Object): string {
      if (errorCode === 'auth/argument-error')
        return 'Email must be a valid string.';
      else if (errorCode === 'auth/invalid-email')
        return 'Email address is not valid.';
      else if (errorCode === 'auth/user-not-found')
        return 'No user corresponding to the email address.';
      else if (errorCode === 'auth/wrong-password')
        return 'Please double check your account.';
      else if (errorCode === 'auth/user-disabled')
        return 'Your account is suspended.';
      else
        return 'Oops! Something going wrong around here.';

  }

}
