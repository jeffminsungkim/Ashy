import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams, Content, TextInput } from 'ionic-angular';

import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { UtilityServiceProvider } from '../../providers/utility-service/utility-service';

import { User } from '../../models/User';

@IonicPage()
@Component({
  selector: 'page-friend-chat',
  templateUrl: 'friend-chat.html',
})
export class FriendChatPage {

  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: TextInput;

  fromUser: User;
  toUser: User;
  roomId: string;
  message: string;
  showEmojiPicker: boolean = false;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public chatService: ChatServiceProvider,
    public userService: UserServiceProvider,
    public utilityService: UtilityServiceProvider) {

    this.toUser = this.navParams.get('listener');
    this.getCurrentUser();
  }

  ionViewDidEnter() {
    this.roomId = this.utilityService.combineUserIdsToGenerateHashKey(this.fromUser.uid, this.toUser.uid);
    this.retrieveRoomHistroy();
  }

  getCurrentUser() {
    this.userService.getCurrentUserObject().take(1).subscribe((user: User) => {
      this.fromUser = user;
    });

  }

  retrieveRoomHistroy() {
    console.log('room id', this.roomId);
  }

  createRoomOnceIfNotExists(message: string) {
    this.chatService.checkRoomsLookup(this.roomId).take(1).subscribe(snapshot => {
      console.log('snap', snapshot);
      if (snapshot.length < 1) {
        this.chatService.createNewChatRoom(this.roomId, this.fromUser, this.toUser, message);
        // this.chatService.pushNewMessage(message, this.roomId, this.fromUser, this.toUser);
        console.log('CRATE ROOM');
        }
      });
  }

  sendMessage() {
    if (!this.message.trim()) return;

    this.chatService.fromUser(this.fromUser);
    this.chatService.toUser(this.toUser);

    this.createRoomOnceIfNotExists(this.message);

    this.chatService.isUserAlreadyMemberOfRoom(this.roomId).take(1).subscribe(res => {
      console.log('data', res);
      console.log('data', res[0].key);
      if (res.length > 0) {
        console.log('message:', this.message);
        this.chatService.pushMessage(this.message, res[0].key, this.fromUser, this.toUser);
        this.message = '';
      } 
    });

    if (!this.showEmojiPicker)
      this.messageInput.setFocus();

  }

  switchEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
    if (!this.showEmojiPicker)
      this.messageInput.setFocus();
        
    this.content.resize();
    this.scrollToBottom();
  }

  onFocus() {
    this.showEmojiPicker = false;
    this.content.resize();
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400)
  }

  backToPreviousView() { this.viewCtrl.dismiss(); }

}
