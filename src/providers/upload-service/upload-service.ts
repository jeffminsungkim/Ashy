import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { UtilityServiceProvider } from '@ashy/services/utility-service/utility-service';
import { Upload } from '@ashy/models/upload';
import * as firebase from 'firebase/app';
import 'firebase/storage';
declare var window: any;


@Injectable()
export class UploadServiceProvider {
  rootDir: string = 'user-profile';
  uploadTask: firebase.storage.UploadTask;
  nativePath: any;
  cameraOptions: CameraOptions = {
    quality: 100,
    correctOrientation: true,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  };

  constructor(private camera: Camera, private utilityService: UtilityServiceProvider) {}

  getDownloadUrlFromPhotoLibrary(uid: string) {
    return new Promise((resolve, reject) => {
      this.camera.getPicture(this.cameraOptions)
      .then((imagePath) => {
        console.log("Image Path", imagePath);
        return this.convertFileImageIntoBlob(imagePath);
      })
      .then((imageBlob) => {
        console.log("Blob", imageBlob);
        return this.uploadImageToStorage(imageBlob, uid);
      })
      .then((snapshot: any) => {
        console.log('downloadURL:', snapshot.downloadURL);
        resolve(snapshot.downloadURL);
      })
      .catch(err => {
        reject(err);
      });
    });
  }

  convertFileImageIntoBlob(imagePath: string) {
    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(imagePath, (fileEntry) => {
        fileEntry.file((resFile) => {
          let reader = new FileReader();
          reader.onloadend = (event: any) => {
            let imageBlob: any = new Blob([event.target.result], { type: 'image/jpeg' });
            resolve(imageBlob);
          };
          reader.onerror = (err) => {
            console.log('Failed file read:' + err.toString());
            reject(err);
          };
          reader.readAsArrayBuffer(resFile);
        });
      });
    });
  }

  uploadIdenticon(svgBlob, uid: string) {
    return new Promise((resolve, reject) => {
      const storageRef = firebase.storage().ref();
      this.uploadTask = storageRef.child(`identicons/${uid}.svg`).put(svgBlob);
      console.log('upload task:', this.uploadTask);
      this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot: any) => {
        console.log('snapshot:', snapshot);
      }, (error) => {
        console.log('uploadimage error', error);
      }, () => {
        resolve(this.uploadTask.snapshot);
      });
    });
  }

  uploadImageToStorage(imageBlob, uid: string) {
    return new Promise((resolve, reject) => {
      const storageRef = firebase.storage().ref();
      this.uploadTask = storageRef.child(`${this.rootDir}/${uid}/${uid}.jpeg`).put(imageBlob);
      console.log('upload task:', this.uploadTask);
      this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot: any) => {
        console.log('snapshot:', snapshot);
      }, (error) => {
        console.log('uploadimage error', error);
      }, () => {
        resolve(this.uploadTask.snapshot);
      });
    });
  }

  deleteFileStorage(uid: string) {
    const storageRef = firebase.storage().ref();
    storageRef.child(`${this.rootDir}/${uid}/thumb_${uid}.jpeg`).delete();
    storageRef.child(`${this.rootDir}/${uid}/${uid}.jpeg`).delete();
  }

}
