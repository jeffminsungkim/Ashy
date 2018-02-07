import { Component, ViewChild, Renderer } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams, Platform, Content } from 'ionic-angular';

import { ChatServiceProvider } from '@ashy/services/chat-service/chat-service';
import { UserServiceProvider } from '@ashy/services/user-service/user-service';
import { UtilityServiceProvider } from '@ashy/services/utility-service/utility-service';
import { AlertServiceProvider } from '@ashy/services/alert-service/alert-service';
import { User } from '@ashy/models/User';

import { Keyboard } from '@ionic-native/keyboard';

import { Subscription } from 'rxjs/Subscription';


@IonicPage()
@Component({
  selector: 'page-friend-chat',
  templateUrl: 'friend-chat.html',
})
export class FriendChatPage {

  @ViewChild(Content) content: Content;

  subscription: Subscription;
  keyboardHideSub: Subscription;
  keybaordShowSub: Subscription;
  inputElement: any;
  textareaHeight: any;
  initialTextAreaHeight: any;
  scrollContentElement: any;
  footerElement: any;
  millis: number = 200;
  fromUser: User;
  toUser: User;
  roomId: string;
  message: string = '';
  history: object[] = [];

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public platform: Platform,
    public renderer: Renderer,
    public keyboard: Keyboard,
    public chatService: ChatServiceProvider,
    public userService: UserServiceProvider,
    public utilityService: UtilityServiceProvider,
    public alertService: AlertServiceProvider) {

    this.toUser = this.navParams.get('toUser');
    this.roomId = this.navParams.get('roomId');
    console.log('constructor toUser', this.toUser);
    console.log('constructor roomId', this.roomId);

    // this.getCurrentUser();
  }

  /*ionViewDidLoad() {

    if (this.platform.is('ios'))
      this.addKeyboardListeners();

    this.scrollContentElement = this.content.getScrollElement();
    this.footerElement = document.getElementsByTagName('page-friend-chat')[0].getElementsByTagName('ion-footer')[0];
    this.inputElement = document.getElementsByTagName('page-friend-chat')[0].getElementsByTagName('textarea')[0];

    this.footerElement.style.cssText = this.footerElement.style.cssText + "transition: all " + this.millis + "ms; -webkit-transition: all " +
      this.millis + "ms; -webkit-transition-timing-function: ease-out; transition-timing-function: ease-out;"

    this.scrollContentElement.style.cssText = this.scrollContentElement.style.cssText + "transition: all " + this.millis + "ms; -webkit-transition: all " +
      this.millis + "ms; -webkit-transition-timing-function: ease-out; transition-timing-function: ease-out;"

    this.textareaHeight = Number(this.inputElement.style.height.replace('px', ''));
    this.initialTextAreaHeight = this.textareaHeight;

    this.updateScroll(500);
  }

  ionViewDidEnter() {
    this.roomId = this.utilityService.combineUserIdsToGenerateHashKey(this.fromUser.uid, this.toUser.uid);
    this.retrieveRoomHistroy();
    this.inspectNewMessage();
  }

  getCurrentUser() {
    this.userService.getCurrentUserObject().take(1).subscribe((user: User) => {
      this.fromUser = user;
    });
  }

  inspectNewMessage() {
    this.subscription = this.chatService.isNewMessageArrived(this.roomId).subscribe(_ => this.updateScroll(250));
  }

  retrieveRoomHistroy() {
    this.chatService.fetchChatHistory(this.roomId).subscribe(data => {
      this.history = data;
    });
  }

  contentMouseDown() {
    this.inputElement.blur();
  }

  onFocus() {
    if (this.platform.is('android')) {
      this.content.resize();
      this.updateScroll(250);
    }
  }


  touchSendButton(event) {
    event.preventDefault();
    event.stopPropagation(); // Stops event bubbling
    this.sendMessage();
  }

  changeTextAreaHeight() {
    let newHeight = Number(this.inputElement.style.height.replace('px', ''));
    if (newHeight !== this.textareaHeight && newHeight < 71) {
      let diffHeight = newHeight - this.textareaHeight;
      this.textareaHeight = newHeight;
      let marginBottom = Number(this.scrollContentElement.style.marginBottom.replace('px', '')) + diffHeight;
      this.renderer.setElementStyle(this.scrollContentElement, 'marginBottom', marginBottom + 'px');
      this.updateScroll(250);
    }
  }

  resetTextAreaHeight() {
    let currentHeight = this.scrollContentElement.style.marginBottom.replace('px', '');
    let newHeight = currentHeight - this.textareaHeight + this.initialTextAreaHeight;
    this.renderer.setElementStyle(this.scrollContentElement, 'marginBottom', newHeight + 'px');
    this.textareaHeight = this.initialTextAreaHeight;
    this.renderer.setElementStyle(this.inputElement, 'height', this.initialTextAreaHeight + 'px');
  }

  sendMessage() {
    if (!this.message.trim()) return;
    this.chatService.createNewChatRoom(this.roomId, this.fromUser, this.toUser, this.message);
    this.chatService.pushMessage(this.message, this.roomId, this.fromUser, this.toUser);
    this.message = '';
    this.resetTextAreaHeight();
    // this.chatService.isUserAlreadyMemberOfRoom(this.roomId).take(1).subscribe(res => {
    //   console.log('data', res);
    //   console.log('data', res[0].key);
    //   if (res.length > 0) {
    //     this.chatService.pushMessage(this.message, res[0].key, this.fromUser, this.toUser);
    //     this.message = '';
    //     console.log('sendMessage()');
    //   }
    // });
  }

  // attchFiles() {
  //   this.alertService.notifyCommingSoon('File Attachment');
  //   this.fabContainer.close();
  // }

  // inspectInputChanges() {
  //   console.log('User is typing...', this.message);
  //   if (!this.utilityService.isStringContainsWhiteSpaceOnly(this.message) && this.message !== '')
  //     this.isUserTyping = true;
  //   else
  //     this.isUserTyping = false;
  // }

  updateScroll(timeout: number) {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, timeout)
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  addKeyboardListeners() {
    this.keyboardHideSub = this.keyboard.onKeyboardHide().subscribe(() => {
      let marginBottom = this.textareaHeight - this.initialTextAreaHeight + 44;
      this.renderer.setElementStyle(this.scrollContentElement, 'marginBottom', marginBottom + 'px');
      this.renderer.setElementStyle(this.footerElement, 'marginBottom', '0px')
    });

    this.keybaordShowSub = this.keyboard.onKeyboardShow().subscribe((e) => {
      let newHeight = (e['keyboardHeight']) + this.textareaHeight - this.initialTextAreaHeight;
      let marginBottom = newHeight + 44 + 'px';
      this.renderer.setElementStyle(this.scrollContentElement, 'marginBottom', marginBottom);
      this.renderer.setElementStyle(this.footerElement, 'marginBottom', e['keyboardHeight'] + 'px');
      this.updateScroll(250);
    });
  }

  removeKeyboardListeners() {
    this.keyboardHideSub.unsubscribe();
    this.keybaordShowSub.unsubscribe();
  }

  backToPreviousView() {
    this.inputElement.blur();
    this.navCtrl.pop().then(_ => {
      if (this.platform.is('ios'))
        this.removeKeyboardListeners();
    });
  }*/

}
