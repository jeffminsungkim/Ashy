import { Component } from '@angular/core';
import { IonicPage, App, NavParams, NavController, Events, ActionSheetController, Tabs } from 'ionic-angular';

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

import { AlertServiceProvider } from '@ashy/services/alert-service/alert-service';
import { AuthServiceProvider } from '@ashy/services/auth-service/auth-service';
import { ChatServiceProvider } from '@ashy/services/chat-service/chat-service';
import { ModalServiceProvider } from '@ashy/services/modal-service/modal-service';
import { UploadServiceProvider } from '@ashy/services/upload-service/upload-service';
import { UserServiceProvider } from '@ashy/services/user-service/user-service';
import { User } from '@ashy/models/User';
import { Upload } from '@ashy/models/upload';

import { Observable } from 'rxjs/Observable';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  user: User;
  currentUser: string;
  avatar: string;
  displayName: string;
  statusMessage: string;
  previewImage: any;

  constructor(
    public app: App,
    public navParams: NavParams,
    public navCtrl: NavController,
    public events: Events,
    public nativePageTransitions: NativePageTransitions,
    public authService: AuthServiceProvider,
    public userService: UserServiceProvider,
    public alertService: AlertServiceProvider,
    public uploadService: UploadServiceProvider,
    public modalService: ModalServiceProvider,
    public chatService: ChatServiceProvider) {

    this.user = this.navParams.get('listener');
    console.log('profile', this.user);
  }

  ionViewDidLoad() {
    console.log("Profile Page DidLoad()");
    // this.user$ = this.authService.currentUserObservable.subscribe((user) => console.log("IAM USER!", user));
    this.currentUser = this.userService.currentUserId;
    this.avatar = this.user.thumbnailURL;
    this.displayName = this.user.displayName;
    this.statusMessage = this.user.statusMessage;
  }

  showOriginalImage() {
    console.log("showOriginalImage()");
  }

  openChatRoom() {
    this.navCtrl.pop();
    const tabsNav = this.app.getNavByIdOrName('appTabs') as Tabs;
    tabsNav.select(1);
    // this.navCtrl.setRoot('FriendChatPage', {listener: this.user});
    this.modalService.createFriendChatRoomModal(this.user);
  }

  editProfile() { this.modalService.showProfileDetailModal(); }

  backToPreviousView() { this.navCtrl.pop(); }

}
