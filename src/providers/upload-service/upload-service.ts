import { Injectable } from '@angular/core';
import { Upload } from '@ashy-models/upload';
import * as firebase from 'firebase/app';
import 'firebase/storage';
declare var window: any;


@Injectable()
export class UploadServiceProvider {
  rootDir: string = 'profile-pictures/';
  uploadTask: firebase.storage.UploadTask;
  nativePath: any;

  constructor() {}

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
      let storageRef = firebase.storage().ref();
       this.uploadTask = storageRef.child(`${this.rootDir}${userDir}/${imageBlob}`).put(imageBlob);
        this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot: any) => {
          console.log('snapshot:', snapshot);
        }, (error) => {
          console.log('uploadimage error', error);
        }, () => {
          resolve(this.uploadTask.snapshot);
        });
      });
  }

  // saveFile(image) {
  //   let ref = this.afDB.object(`${this.rootNode}/${this.userService.currentUserId}`);
  //   return new Promise((resolve, reject) => {
  //     let data = {
  //       'url': image.downloadURL,
  //       'uid': image.metadata.name,
  //       'email': this.userService.currentUserEmail,
  //       'lastUpdated': new Date().getTime()
  //     };
  //     ref.update(data).then(() => {
  //       this.userService.updatePhotoUrlFromPlaceholder(image.downloadURL);
  //     }).catch(err => reject(err));
  //   });
  // }


  // pushUpload(upload: Upload) {
  //   let storageRef = firebase.storage().ref();
  //   this.uploadTask = storageRef.child(`${this.rootNode}/${this.userService.currentUserId}`).put(upload.file);
  //   this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
  //     (snapshot: any) => {
  //       upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //       console.log("PROGRESS:", upload.progress);
  //     }, (error) => {
  //       console.log("UPLOAD ERROR:", error)
  //     }, () => {
  //       upload.url = this.uploadTask.snapshot.downloadURL
  //       upload.name = upload.file.name
  //     });
  // }

  // private saveFileNode(upload: Upload) {
  //   this.afDB.object(`${this.rootNode}/${this.userService.currentUserId}`).update(upload)
  //   .then(() => {
  //     this.userService.updatePhotoUrlFromPlaceholder(upload.url);
  //   });
  // }

  // deleteUpload() {
  //   this.userService.updatePhotoUrlToPlaceholder();
  //   this.deleteFileNode().then(() => {
  //     this.deleteFileStorage();
  //   })
  //   .catch(error => console.log("DELETE FILE STORAGE ERROR:", error))
  // }

  deleteFileStorage(uid: string) {
    const storageRef = firebase.storage().ref();
    storageRef.child(`${this.rootDir}${uid}`).delete();
  }

//   deleteFileNode() {
//     let uid = this.userService.currentUserId;
//     return this.afDB.list(`${this.rootNode}`).remove(uid);
//  }

}
