import { Injectable } from '@angular/core';


@Injectable()
export class InterfaceOption {

  svgPath: string = 'assets/svgs/manhatten-pastel-red-200.svg';

  constructor() {

  }

  /**
   * Alert Controller Options
   */

  makeErrorMessageOpt(message: string) {
    return {
      title: 'Be careful!',
      message: message,
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    }
  }

  makeEmailVerificationOpt() {
    return {
      title: 'Email has been sent!',
      message: 'Please wait, this might take a few seconds or minutes.',
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    }
  }

  makePasswordResetOpt() {
    return {
      title: 'Verification Email has sent!',
      subTitle: 'Please confirm the verification link from your email account. This might take a few minutes.',
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    }
  }

  makeConfirmPasswordResetEmail() {
    return {
      title: 'Send Password Reset Email?',
      message: 'Please confirm the verification link from your email account. This might take a few minutes.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Send',
          handler: () => {
          }
        }
      ]
    }
  }

  /**
   * Loading Controller Options
   */

  makeWaitLoaderOpt() {
    return {
      spinner: 'hide',
      content: `<img src=${this.svgPath}>`
    }
  }


  /**
   * Toast Controller Options
   */

  makeShowToastOpt(message: string, duration: number = 3000) {
    return {
      message,
      duration
    }
  }



}
