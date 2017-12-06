import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class LoadingServiceProvider {
  loader: any;

  constructor(private loadingCtrl: LoadingController) { }

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

  dismiss() { return this.loader.dismiss(); }

}
