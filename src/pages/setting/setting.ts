import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  IonicPage,
  NavParams,
  Events,
  ActionSheetController,
  LoadingController,
  ModalController,
  ViewController,
  ToastController,
  Platform
 } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import * as jdenticon from 'jdenticon';

import { AuthServiceProvider } from '@ashy/services/auth-service/auth-service';
import { LocalStorageServiceProvider } from '@ashy/services/local-storage-service/local-storage-service';
import { InterfaceOption } from '@ashy/services/interface-option//interface-option';
import { UserServiceProvider } from '@ashy/services/user-service/user-service';
import { UploadServiceProvider } from '@ashy/services/upload-service/upload-service';
import { User } from '@ashy/models/user';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/take';


@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  @ViewChild('avatarHolder') avatarHolder: ElementRef;
  version: string;
  user: User;
  avatar: string;
  identicon: string;
  identiconHash: string;
  isVersionClicked: boolean;

  constructor(
    public navParams: NavParams,
    private events: Events,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    private platform: Platform,
    private appVersion: AppVersion,
    private interfaceOpt: InterfaceOption,
    private localStorage: LocalStorageServiceProvider,
    public authService: AuthServiceProvider,
    public userService: UserServiceProvider,
    public uploadService: UploadServiceProvider) {

    this.identicon = this.navParams.get('identicon');
    this.user = this.navParams.get('user');
    this.avatar = this.user.thumbnailURL;
    this.isVersionClicked = false;
  }

  ionViewWillEnter() {
    this.retrieveHash();
    this.subscribeNewHash();
    this.retrieveAppVersion();
  }

  /*
  Runs when the page has loaded. This event only happens once per page being created.
  If a page leaves but is cached, then this event will not fire again on a subsequent viewing.
  The ionViewDidLoad event is good place to put your setup code for the page.
  */
  ionViewDidLoad() {
    this.setIdenticon(); // Put setIdenticon() in ionViewDidLoad lifecycle to prevent nativeElement undefined
  }

  retrieveAppVersion() {
    if (this.platform.is('cordova') && !this.isVersionClicked)
      this.appVersion.getVersionNumber().then(version => this.version = "Version " + version);
    else
      this.version = "Latest Version 😊 ";
  }

  checkVersionOfApp() {
    this.isVersionClicked === false ? this.isVersionClicked = true : this.isVersionClicked = false;
    this.retrieveAppVersion();
  }

  retrieveHash() { this.localStorage.getIdenticonHash().subscribe(hash => this.identiconHash = hash) }

  setIdenticon() { if (this.identicon && this.avatar === null) this.avatarHolder.nativeElement.src = this.identicon; }

  private subscribeNewHash() {
    this.events.subscribe('new:identiconHash', (hash) => {
      if (hash) this.setIdenticonFromEvents(hash);
    });
  }

  setIdenticonFromEvents(hash: string) {
    if (hash) {
      let svg = jdenticon.toSvg(hash, Math.min(30, 30));
      this.identicon = "data:image/svg+xml," + encodeURIComponent(svg);
      this.avatarHolder.nativeElement.src = this.identicon;
    }
  }

  goToProfileDetail() {
    const param = { user: this.user, currentEmail: this.authService.currentUserEmail, showCloseBtn: false };
    const modalWrapper = this.modalCtrl.create('ModalWrapperPage', { page: 'ProfileDetailPage', params: param });
    modalWrapper.onDidDismiss(callback => {
      if (callback !== undefined) this.user.gender = callback;
    });
    modalWrapper.present();
  }

  customizeProfilePhoto() {
    const defaultOption = {
      buttons: [
        {
          text: 'Photo from library',
          handler: () => {
            this.uploadProfilePicture();
            console.log('Photo from library');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    };
    const extraRemovalOption = {
      buttons: [
        {
          text: 'Photo from library',
          handler: () => {
            this.uploadProfilePicture();
            console.log('Photo from library');
          }
        },
        {
          text: 'Remove Profile Photo',
          role: 'destructive',
          handler: () => {
            this.removeProfilePicture();
            console.log('Remove Profile Photo');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    };

    this.avatar ? this.actionSheetCtrl.create(extraRemovalOption).present() : this.actionSheetCtrl.create(defaultOption).present();
  }

  uploadProfilePicture() {
    let loader = this.loadingCtrl.create(this.interfaceOpt.makeWaitLoaderOpt());
    this.uploadService.getDownloadUrlFromPhotoLibrary(this.user.uid).then((url: string) => {
      loader.present();
      console.log("Received Download URL", url);
      this.avatar = url;
      this.userService.updateUserProfile(this.user.displayName, this.avatar).then((accessToken) => {
        console.log('AccessToken:', accessToken);
        this.localStorage.storeToken('accessToken', { accessToken: accessToken });
        loader.dismiss();
      })
    }).catch((err) => {
      loader.dismiss();
      console.log('Upload Profile Picture Error:', err);
    });
  }

  removeProfilePicture() {
    let loader = this.loadingCtrl.create(this.interfaceOpt.makeWaitLoaderOpt());
    if (this.avatar) {
      loader.present();
      this.avatar = null;
      // this.uploadService.deleteFileStorage(this.user.uid);
      // this.setIdenticon();
      this.userService.useIdenticon().then(() => {
        this.setIdenticon();
        loader.dismiss();
      });
    }
  }

  async logout() {
    this.localStorage.clearStorage();
    // TODO: Add a confirm button
    this.dismissModal();
    this.userService.updateCurrentUserActiveStatusTo('signout');
    this.userService.updateCurrentUserAppUsageStatusTo(false, 'signout');
    const user: any = await this.authService.signOut();
    this.toastCtrl.create(this.interfaceOpt.makeShowToastOpt(`Signed out as ${user.email}`));
  }

  async deleteAccount() {
    try {
      // TODO: Add a confirm button and require current password
      const deleteAccount: any = this.authService.deleteAccount();
      if (deleteAccount.status) {
        this.localStorage.clearStorage();
        this.dismissModal();
      }
    } catch(error) {
      console.error('Deleting account error', error.message);
    }
  }

  dismissModal() { this.viewCtrl.dismiss(); }
}
