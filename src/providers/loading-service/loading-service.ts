import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class LoadingServiceProvider {

  loader: any;
  svgPath: string = 'assets/svgs/manhatten-pastel-red-200.svg';

  constructor(public loadingCtrl: LoadingController) { }

  showWaitLoader() {
    this.loader = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src=${this.svgPath}>`
    });
    this.loader.present();
  }
  dismiss() { return this.loader.dismiss(); }

}
