import { Injectable } from '@angular/core';
import { UtilityServiceProvider } from '@ashy-services/utility-service/utility-service';
import { Upload } from '@ashy-models/upload';
import * as firebase from 'firebase/app';
import 'firebase/storage';
declare var window: any;


@Injectable()
export class UploadServiceProvider {
  rootDir: string = 'profile-pictures';
  uploadTask: firebase.storage.UploadTask;
  nativePath: any;

  constructor(private utilityService: UtilityServiceProvider) {}

  // private generateUUID(): string {
  //   function s4() {
  //     return Math.floor((1 + Math.random()) * 0x10000)
  //       .toString(16)
  //       .substring(1);
  //   }
  //   return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
  //     s4() + '-' + s4() + s4() + s4();
  // }

  convertImageIntoBlob(imagePath: string) {
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

  uploadImageToCurrentUserDir(imageBlob, userDir: string) {
    return new Promise((resolve, reject) => {
      const storageRef = firebase.storage().ref();
       this.uploadTask = storageRef.child(`${this.rootDir}/${userDir}/${this.utilityService.generateRandomString()}`).put(imageBlob);
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
    storageRef.child(`${this.rootDir}/${uid}`).delete();
  }

}
