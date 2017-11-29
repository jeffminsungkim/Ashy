import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';

@Injectable()
export class ModalServiceProvider {

  constructor(private modalCtrl: ModalController) { }

  showProfileModal(status: boolean) { this.modalCtrl.create('ProfilePage', { emailVerified: status }).present(); }

}
