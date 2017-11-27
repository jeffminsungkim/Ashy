import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';

@Injectable()
export class ModalServiceProvider {

  constructor(private modalCtrl: ModalController) {

  }

  showProfileModal() {
    let profileModal = this.modalCtrl.create('ProfilePage');
    profileModal.present();
  }

}
