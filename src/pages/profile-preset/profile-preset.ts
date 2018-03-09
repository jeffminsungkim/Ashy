import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IonicPage, NavController, NavParams, ActionSheetController, LoadingController, ToastController, Platform, Loading } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { LocalStorageServiceProvider } from '@ashy/services/local-storage-service/local-storage-service';
import { InterfaceOption } from '@ashy/services/interface-option//interface-option';
import { UserServiceProvider } from '@ashy/services/user-service/user-service';
import { UploadServiceProvider } from '@ashy/services/upload-service/upload-service';

import * as jdenticon from 'jdenticon';
import 'rxjs/add/operator/take'
import 'rxjs/add/operator/switchMap';


@IonicPage()
@Component({
  selector: 'page-profile-preset',
  templateUrl: 'profile-preset.html',
})
export class ProfilePresetPage {

  @ViewChild('avatarHolder') avatarHolder: ElementRef;
  displayName: string;
  photoURL: string;
  uid: string;
  identiconHash: string;
  svgBlob: any;

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
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private http: HttpClient,
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera,
    public platform: Platform,
    private localStorageService: LocalStorageServiceProvider,
    private interfaceOpt: InterfaceOption,
    private userService: UserServiceProvider,
    private uploadService: UploadServiceProvider) {
      this.retrieveHash(); // Must be called from the construtor
      this.uid = this.userService.currentUserId;
      this.photoURL = '';
  }

  ionViewWillEnter() {
    this.svgBlob = this.setIdenticon();
  }

  retrieveHash() {
    this.localStorageService.getIdenticonHash().subscribe(hash => this.identiconHash = hash);
  }

  setIdenticon() {
    if (this.identiconHash) {
      let svg = jdenticon.toSvg(this.identiconHash, Math.min(110, 100));
      let encodeSvg = "data:image/svg+xml," + encodeURIComponent(svg);
      this.avatarHolder.nativeElement.src = encodeSvg;
      return new Blob([svg], { type: 'image/svg+xml' });
    }
  }

  uploadIdenticon(blob: any, uid: string) {
    this.uploadService.uploadIdenticon(blob, uid).then((snapshot: any) => {
      console.log('downloadURL:', snapshot.downloadURL);
      const url = snapshot.downloadURL;
      this.userService.setIdenticon(url).then(() => console.log('Successfully set identicon url'));
    });
  }

  uploadProfilePicture() {
    let loader = this.loadingCtrl.create(this.interfaceOpt.makeWaitLoaderOpt());
    this.camera.getPicture(this.cameraOptions).then((imagePath) => {
      loader.present();
      console.log("IMAGE PATH", imagePath);
      return this.uploadService.convertFileImageIntoBlob(imagePath);
    }).then((imageBlob) => {
      console.log("IMAGE BLOB", imageBlob);
      return this.uploadService.uploadImageToStorage(imageBlob, this.uid);
    }).then((snapshot: any) => {
      this.photoURL = snapshot.downloadURL;
      console.log("FILE UPLOAD SUCCESSFULLY", snapshot.downloadURL);
      loader.dismiss();
    }).catch((err) => console.log('Error:', err));
  }

  presentActionSheetUploadProfilePicture() {
    let actionSheet = this.actionSheetCtrl.create({
      title: !this.platform.is('ios') ? 'Albums' : null,
      cssClass:'action-sheet-buttons',
      buttons: [
        {
          text: 'Photo from library',
          icon: !this.platform.is('ios') ? 'cloud-upload' : null,
          handler: () => {
            this.uploadProfilePicture();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
        }
      ]
    });
    actionSheet.present();
  }

  startApp() {
    let loader = this.loadingCtrl.create(this.interfaceOpt.makeWaitLoaderOpt());
    loader.present();
    this.uploadIdenticon(this.svgBlob, this.uid);
    const data = {
      activityState: {
        currentActiveStatus: "online",
        usingApp: "true"
      },
      user: {
        displayName: this.displayName,
        photoURL: this.photoURL,
        currentActiveStatus: "online",
        emailVerified: "true"
      }
    };
    console.log('data:', JSON.stringify(data));

    this.userService.updateUserProfile(this.displayName, this.photoURL).then(accessToken => {
      console.log('new Token?:', accessToken);
      this.localStorageService.storeToken('accessToken', { accessToken: accessToken });
      const url = 'https://us-central1-ashy-development.cloudfunctions.net/initDefaultStateAuthUserStartapp/';
      this.http.post(url, JSON.stringify(data), {
        headers: {'Authorization': accessToken, 'Content-Type': 'application/json; charset=utf-8'}
      }).subscribe((res) => {
        console.log('res?', res);
        loader.dismiss();
        this.toastCtrl.create(this.interfaceOpt.makeShowToastOpt(`Signed in as ${this.userService.currentUserEmail}`)).present();
        this.navCtrl.setRoot('HomePage');
      }, (err) => {
        loader.dismiss();
        console.log('HTTP POST Error', err);
      });
    });
  }
}
