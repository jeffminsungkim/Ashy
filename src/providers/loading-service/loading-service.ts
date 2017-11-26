import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class LoadingServiceProvider {
  loader: any;
  constructor(private loadingCtrl: LoadingController) { }

  show(message: string) {
    this.loader = this.loadingCtrl.create({ content: message});
    return this.loader.present();
  }

  dismiss() {
    return this.loader.dismiss();
  }

}
