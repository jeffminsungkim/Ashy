import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { User } from '@ashy-models/user';

@Injectable()
export class ModalServiceProvider {

  constructor(public modalCtrl: ModalController) { }

  showProfileModal(user: User) { this.modalCtrl.create('ProfilePage', {listener: user}).present(); }

  showProfileDetailModal() { this.modalCtrl.create('ProfileDetailPage').present(); }

  showAddFriendModal() { this.modalCtrl.create('AddFriendPage').present(); }

  createFriendChatRoomModal(user: User) { this.modalCtrl.create('FriendChatPage', {toUser: user}).present(); }

  openFriendChatRoomModal(roomId: string, user: any) { this.modalCtrl.create('FriendChatPage', {roomId: roomId, toUser: user}).present(); }

}