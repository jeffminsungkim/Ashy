import { Component } from '@angular/core';
import { IonicPage, App, NavParams, NavController, Events, ActionSheetController, Tabs } from 'ionic-angular';

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

import { NgProgress } from 'ngx-progressbar';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { UploadServiceProvider } from '../../providers/upload-service/upload-service';
import { ModalServiceProvider } from '../../providers/modal-service/modal-service';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';

import { Observable } from 'rxjs/Observable';

import { User } from '../../models/User';
import { Upload } from '../../models/upload';

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
    public ngProgress: NgProgress,
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
    this.avatar = this.user.photoURL;
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
    this.modalService.openFriendChatRoomModal(this.user);
  }

  editProfile() { this.modalService.showProfileDetailModal(); }

  backToPreviousView() { this.navCtrl.pop(); }

}