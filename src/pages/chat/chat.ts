import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ChatServiceProvider } from '@ashy/services/chat-service/chat-service';
import { ModalServiceProvider } from '@ashy/services/modal-service/modal-service';
import { User } from '@ashy/models/User';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/combineLatest';


@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  friendChats$: Observable<any[]>;
  toUser: User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public chatService: ChatServiceProvider,
    public modalService: ModalServiceProvider) {}

  ionViewWillEnter() {
    // this.displayListOfChatRooms();
  }

  /*displayListOfChatRooms() {
    this.friendChats$ = this.chatService.fetchChatRoomsKeys().switchMap(room => {
      return Observable.combineLatest(room.map(friendChat => this.chatService.fetchFriendChatRooms(friendChat.key, friendChat.payload.val())));
    });
  }

  enterChatRoom(chat: any) {
    console.log('enter chat room:', chat);
    this.modalService.openFriendChatRoomModal(chat.roomId, chat);
  }

  destroyChatroom(chat: any) {
    console.log('Destroy chat room:', chat);
    this.chatService.removeFriendChat(chat.roomId, chat.uid);
  }*/

}
