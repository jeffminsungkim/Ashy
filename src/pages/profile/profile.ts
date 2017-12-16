import { Component } from '@angular/core';
import { IonicPage, App, NavParams, NavController, ActionSheetController, Tabs } from 'ionic-angular';

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

import { NgProgress } from 'ngx-progressbar';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { UploadServiceProvider } from '../../providers/upload-service/upload-service';
import { ModalServiceProvider } from '../../providers/modal-service/modal-service';

import { Observable } from 'rxjs/Observable';

import { User } from '../../models/User';
import { Upload } from '../../models/upload';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  private user: User;
  private currentUser: string;
  private avatar: string;
  private displayName: string;
  private statusMessage: string;
  private previewImage: any;

  constructor(
    private app: App,
    public navParams: NavParams,
    public navCtrl: NavController,
    private nativePageTransitions: NativePageTransitions,
    private ngProgress: NgProgress,
    private authService: AuthServiceProvider,
    private userService: UserServiceProvider,
    private alertService: AlertServiceProvider,
    private uploadService: UploadServiceProvider,
    private modalService: ModalServiceProvider) {

    this.user = this.navParams.get('user');
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
    this.navCtrl.setRoot('FriendChatPage', {user: this.user});

  }

  editProfile() { this.modalService.showProfileDetailModal(); }

  backToPreviousView() { this.navCtrl.pop(); }

}