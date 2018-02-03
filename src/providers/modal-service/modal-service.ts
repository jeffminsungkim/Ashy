import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { User } from '@ashy-models/user';

@Injectable()
export class ModalServiceProvider {

  constructor(public modalCtrl: ModalController) { }

  showProfileModal(user: User) { this.modalCtrl.create('ProfilePage', {listener: user}).present(); }

  showProfileDetailModal() { this.modalCtrl.create('ProfileDetailPage').present(); }

  showAddFriendModal(user: User) { this.modalCtrl.create('AddFriendPage', {me: user}).present(); }

  showEmailResetModal(email: string) { return this.modalCtrl.create('EmailResetPage', {oldEmail: email}); }

  createFriendChatRoomModal(user: User) { this.modalCtrl.create('FriendChatPage', {toUser: user}).present(); }

  openFriendChatRoomModal(roomId: string, user: any) { this.modalCtrl.create('FriendChatPage', {roomId: roomId, toUser: user}).present(); }

}
