import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, LoadingController, ModalController, ViewController, ToastController, Platform } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';

import { AuthServiceProvider } from '@ashy/services/auth-service/auth-service';
import { LocalStorageServiceProvider } from '@ashy/services/local-storage-service/local-storage-service';
import { InterfaceOption } from '@ashy/services/interface-option//interface-option';
import { UserServiceProvider } from '@ashy/services/user-service/user-service';
import { ModalServiceProvider } from '@ashy/services/modal-service/modal-service';
import { UploadServiceProvider } from '@ashy/services/upload-service/upload-service';
import { User } from '@ashy/models/user';
import { Camera, CameraOptions } from '@ionic-native/camera';

import * as jdenticon from 'jdenticon';

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

  cameraOptions: CameraOptions = {
    quality: 100,
    correctOrientation: true,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public elementRef: ElementRef,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    private platform: Platform,
    private appVersion: AppVersion,
    public camera: Camera,
    private interfaceOpt: InterfaceOption,
    private localStorageService: LocalStorageServiceProvider,
    public authService: AuthServiceProvider,
    public userService: UserServiceProvider,
    public modalService: ModalServiceProvider,
    public uploadService: UploadServiceProvider) {
    this.identicon = this.navParams.get('identicon');
    this.user = this.navParams.get('user');
    this.avatar = this.user.thumbnailURL;
  }

  ionViewWillEnter() {
    this.retrieveAppVersion();
    this.retrieveHash();
  }

  ionViewDidLoad() {
    this.setIdenticon(); // Put setIdenticon() in ionViewDidLoad lifecycle to prevent nativeElement undefined
  }

  retrieveAppVersion() {
    if (this.platform.is('cordova')) this.appVersion.getVersionNumber().then(version => this.version = "Version " + version);
  }

  retrieveHash() {
    this.localStorageService.getIdenticonHash().subscribe(hash => this.identiconHash = hash);
  }

  setIdenticon() {
    if (this.identicon && this.avatar === null) this.avatarHolder.nativeElement.src = this.identicon;
  }

  goToProfileDetail() {
    this.modalCtrl.create('ModalWrapperPage', { page: 'ProfileDetailPage', user: this.user}).present();
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
    this.camera.getPicture(this.cameraOptions)
    .then((imagePath) => {
      loader.present();
      console.log("Image Path", imagePath);
      return this.uploadService.convertImageIntoBlob(imagePath);
    })
    .then((imageBlob) => {
      console.log("Blob", imageBlob);
      return this.uploadService.uploadImageToStorage(imageBlob, this.user.uid);
    })
    .then((snapshot: any) => {
      console.log('downloadURL:', snapshot.downloadURL);
      this.avatar = snapshot.downloadURL;
      console.log("Successfully uploaded!", snapshot.downloadURL);
      loader.dismiss();
    })
    .then(() => {
      return this.userService.updateUserProfile(this.user.displayName, this.avatar);
    })
    .then((accessToken) => {
      console.log('AccessToken:', accessToken);
      this.localStorageService.storeToken('accessToken', { accessToken: accessToken });
    })
    .catch(err => {
      console.log('Error:', err);
      loader.dismiss();
    })
  }

  removeProfilePicture() {
    if (this.avatar) {
      this.avatar = null;
      this.userService.useIdenticon().then(() => this.setIdenticon());
    }
  }

  async logout() {
    this.localStorageService.clearStorage();
    // TODO: Add a confirm button
    this.dismissModal();
    this.userService.updateCurrentUserActiveStatusTo('signout');
    this.userService.updateCurrentUserAppUsageStatusTo(false, 'signout');
    const user: any = await this.authService.signOut();
    this.toastCtrl.create(this.interfaceOpt.makeShowToastOpt(`Signed out as ${user.email}`));
  }

  checkVersionOfApp() {
    console.log('clicked!!!!!');
  }

  deleteAccount() {
    this.localStorageService.clearStorage();
    // TODO: Add a confirm button
    this.dismissModal();
    this.authService.deleteAccount();
  }

  dismissModal() {
    this.viewCtrl.dismiss();
  }
}
