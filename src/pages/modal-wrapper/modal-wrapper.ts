import { Component } from '@angular/core';
import { IonicPage,  NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-modal-wrapper',
  templateUrl: 'modal-wrapper.html',
})
export class ModalWrapperPage {
  modalPage: any;
  modalParams: any = {};

  constructor(public navParams: NavParams, public viewCtrl: ViewController) {
    this.modalParams = this.navParams.get('params');
  }

  ionViewDidLoad() {
    this.modalPage = this.navParams.get('page');
  }

  dismissModal(params?: any) {
    params !== undefined ? this.viewCtrl.dismiss(params) : this.viewCtrl.dismiss();
  }

}
