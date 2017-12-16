import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { User } from '../../models/user';

@Injectable()
export class ModalServiceProvider {

  constructor(private modalCtrl: ModalController) { }

  showProfileModal(user: User) { this.modalCtrl.create('ProfilePage', {user: user}).present(); }

  showProfileDetailModal() { this.modalCtrl.create('ProfileDetailPage').present(); }

  showAddFriendModal() { this.modalCtrl.create('AddFriendPage').present(); }

}
