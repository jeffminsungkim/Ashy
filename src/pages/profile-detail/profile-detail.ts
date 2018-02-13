import { Component, ViewChild, Renderer, ElementRef, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { IonicPage, NavController, NavParams, ActionSheetController, ViewController } from 'ionic-angular';

import { UserServiceProvider } from '@ashy/services/user-service/user-service';
import { UploadServiceProvider } from '@ashy/services/upload-service/upload-service';
import { Upload } from '@ashy/models/upload';

import { Camera, CameraOptions } from '@ionic-native/camera';

import { Subscription } from 'rxjs/Subscription';


@IonicPage()
@Component({
  selector: 'page-profile-detail',
  templateUrl: 'profile-detail.html',
})
export class ProfileDetailPage implements OnDestroy {
  subscription: Subscription;
  previewImage: any;
  avatar: string;
  displayName: string;
  username: string;
  gender: string;

  @ViewChild('genderMale', {read: ElementRef}) maleButton;
  @ViewChild('genderFemale', {read: ElementRef}) femaleButton;

  selectedFile: FileList;
  currentUpload: Upload;

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
    public viewCtrl: ViewController,
    public renderer: Renderer,
    public camera: Camera,
    public userService: UserServiceProvider,
    public uploadService: UploadServiceProvider) {

    // this.getUserProfile();
  }

  /*getUserProfile() {
    this.subscription = this.userService.getCurrentUserObject().subscribe((user: any) => {
      console.log("Current user:", user);
      this.avatar = user.photoURL;
      this.displayName = user.displayName;
      this.gender = user.gender;
      this.username = user.username;
    });
  }*/

  changeDisplayName() {
    console.log("changeDisplayName()");
  }

  /* detectFiles(event) {
    console.log("CALL detectFiles()");
    this.selectedFile = event.target.files;
    console.log("tt:", this.selectedFile[0]);
    let reader = new FileReader();
    if (this.selectedFile) {
      reader.onload = (event: any) => {
        this.previewImage = event.target.result;
        console.log("result:",this.previewImage );
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  uploadSingleFile() {
    let file = this.selectedFile.item(0);
    console.log('file:', file);
    this.currentUpload = new Upload(file);
    this.uploadService.pushUpload(this.currentUpload);
    this.selectedFile = null;
    this.previewImage = null;
  }*/

  /*deleteUploadFile() {
    if (this.avatar !== this.previewImage) {
        this.uploadService.deleteUpload();
        this.avatar = this.userService.currentUserPhotoURL;
      }
  }

  uploadSingleImage() {
    this.camera.getPicture(this.cameraOptions).then((imagePath) => {
      this.loadingService.show('Updating...');
      console.log("IMAGE PATH", imagePath);
      return this.uploadService.convertImageIntoBlob(imagePath);
    }).then((imageBlob) => {
      console.log("IMAGE BLOB", imageBlob);
      return this.uploadService.uploadImage(imageBlob);
    }).then((snapshot: any) => {
      this.avatar = snapshot.downloadURL;
      console.log("FILE UPLOAD SUCCESSFULLY", snapshot.downloadURL);
      this.previewImage = null;
      this.loadingService.dismiss();
      return this.uploadService.saveFile(snapshot);
    }).then((uploadSnapshot: any) => {
       console.log("Saved as a reference!!");
    });

  }

  presentActionSheet() {
   let actionSheet = this.actionSheetCtrl.create({
     buttons: [
       {
         text: 'Photo from library',
         handler: () => {
           this.uploadSingleImage();
           console.log('Photo from library');
         }
       },
       {
         text: 'Remove Profile Photo',
         role: 'destructive',
         handler: () => {
           this.deleteUploadFile();
           console.log('Remove Profile Photo');
         }
       },
       {
         text: 'Cancel',
         role: 'cancel',
         handler: () => {
           console.log('Cancel clicked');
         }
       }
     ]
   });
   actionSheet.present();
 }

  selectMale() {
   let gender = 'Male';
   this.userService.updateGender(gender);
   this.fadeGenderButtonsAway();
  }

  selectFemale() {
   let gender = 'Female';
   this.userService.updateGender(gender);
   this.fadeGenderButtonsAway();
  }

  fadeGenderButtonsAway() {
   this.renderer.setElementStyle(this.maleButton.nativeElement, 'opacity', '0');
   this.renderer.setElementStyle(this.femaleButton.nativeElement, 'opacity', '0');
  }

  editUsername() {
    this.navCtrl.push('UsernamePage', { 'username': this.username });
  }*/

  closeModal() { this.navCtrl.pop(); }

  ngOnDestroy() {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
      console.log("ProfileDetail ngOnDestroy");
    }
  }

}
