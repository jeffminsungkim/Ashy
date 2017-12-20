import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { User } from '../../models/user';

@Injectable()
export class ModalServiceProvider {

  constructor(public modalCtrl: ModalController) { }

  showProfileModal(user: User) { this.modalCtrl.create('ProfilePage', {listener: user}).present(); }

  showProfileDetailModal() { this.modalCtrl.create('ProfileDetailPage').present(); }

  showAddFriendModal() { this.modalCtrl.create('AddFriendPage').present(); }

  openFriendChatRoomModal(user: User) { this.modalCtrl.create('FriendChatPage', {listener: user}).present(); }

}
