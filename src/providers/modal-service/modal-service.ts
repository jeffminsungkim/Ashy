import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';

@Injectable()
export class ModalServiceProvider {

  constructor(private modalCtrl: ModalController) { }

  showProfileModal() { this.modalCtrl.create('ProfilePage').present(); }

  showProfileDetailModal() { this.modalCtrl.create('ProfileDetailPage').present(); }

}
