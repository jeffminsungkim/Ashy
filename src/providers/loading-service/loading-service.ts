import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class LoadingServiceProvider {

  loader: any;

  constructor(public loadingCtrl: LoadingController) { }

  show(message: string) {
    this.loader = this.loadingCtrl.create({ content: message});
    this.loader.present();
  }

  showWaitLoader() {
    this.loader = this.loadingCtrl.create({ content: 'Please wait...'});
    this.loader.present();

    setTimeout(() => {
      this.loader.dismiss();
    }, 3000);
  }

  showAuthenticationLoader() {
    this.loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Authenticating...'
    });
    this.loader.present();
  }

  dismiss() { return this.loader.dismiss(); }

}
