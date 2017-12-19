import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/combineLatest';

import { ChatServiceProvider } from '../../providers/chat-service/chat-service';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  private friendChats$: Observable<any[]>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private chatService: ChatServiceProvider) {}

  ionViewWillEnter() {
    this.displayListOfChatRooms();
  }

  displayListOfChatRooms() {
    this.friendChats$ = this.chatService.fetchChatRoomsKeys().switchMap(room => {
      return Observable.combineLatest(room.map(friendChat => this.chatService.fetchFriendChatRooms(friendChat.key, friendChat.payload.val())));
    });
  }

  enterChatRoom() {

  }

}
