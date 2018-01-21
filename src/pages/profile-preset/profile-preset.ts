import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AuthServiceProvider } from '@ashy-services/auth-service/auth-service';
import { LoadingServiceProvider } from '@ashy-services/loading-service/loading-service';
import { ToastServiceProvider } from '@ashy-services/toast-service/toast-service';
import { UserServiceProvider } from '@ashy-services/user-service/user-service';
import { UploadServiceProvider } from '@ashy-services/upload-service/upload-service';


@IonicPage()
@Component({
  selector: 'page-profile-preset',
  templateUrl: 'profile-preset.html',
})
export class ProfilePresetPage {

  public avatar: string;
  public displayName: string;
  public placeholder: string = 'assets/avatar/placeholder.jpg';

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
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera,
    private authService: AuthServiceProvider,
    private  loadingService: LoadingServiceProvider,
    private toastService: ToastServiceProvider,
    private userService: UserServiceProvider,
    private uploadService: UploadServiceProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePresetPage');
  }

  uploadProfilePicture() {
    this.camera.getPicture(this.cameraOptions).then((imagePath) => {
      this.loadingService.show('Please wait');
      console.log("IMAGE PATH", imagePath);
      return this.uploadService.convertImageIntoBlob(imagePath);
    }).then((imageBlob) => {
      console.log("IMAGE BLOB", imageBlob);
      return this.uploadService.uploadImageToCurrentUserDir(imageBlob, this.userService.currentUserId);
    }).then((snapshot: any) => {
      this.avatar = snapshot.downloadURL;
      console.log("FILE UPLOAD SUCCESSFULLY", snapshot.downloadURL);
      this.placeholder = null;
      this.loadingService.dismiss();
    });
  }

  deleteUploadFile() {

  }
  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      cssClass:'alert-buttons',
      buttons: [
        {
          text: 'Photo from library',
          handler: () => {
            this.uploadProfilePicture();
          }
        },
        {
          text: 'Remove Profile Photo',
          role: 'destructive',
          cssClass: 'remove-button',
          handler: () => {
            this.deleteUploadFile();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  startApp() {
    this.authService.updateDisplayname(this.displayName);
    this.userService.updateDisplayname(this.displayName);
    this.userService.updateCurrentUserActiveStatusTo('firstlogin');
    this.userService.updateLastLoginTime();
    this.userService.updateAppMetaData();
    this.toastService.show(`Signed in as ${this.userService.currentUserEmail}`);
    this.userService.updateCurrentUserAppUsageStatusTo(true, 'firstlogin');
    this.navCtrl.setRoot('HomePage');
  }

}
