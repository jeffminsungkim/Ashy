import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import 'firebase/storage';

import { UserServiceProvider } from '../user-service/user-service';
import { ModalServiceProvider } from '../modal-service/modal-service';

import { Upload } from '../../models/upload';

declare var window: any;

@Injectable()
export class UploadServiceProvider {
  rootNode: string = 'profilepics';
  uploadTask: firebase.storage.UploadTask;
  placeHolderImageURL: string;
  nativePath: any;

  constructor(
    public afDB: AngularFireDatabase,
    public userService: UserServiceProvider,
    public modalService: ModalServiceProvider) {
    this.placeHolderImageURL = 'https://firebasestorage.googleapis.com/v0/b/chattycherry-3636c.appspot.com/o/user-default.png?alt=media&token=f85be639-9a1c-4c79-a28d-361171358a41';
  }

  private generateUUID(): string {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

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

  uploadImage(imageBlob) {
    return new Promise((resolve, reject) => {
      let storageRef = firebase.storage().ref();
       this.uploadTask = storageRef.child(`${this.rootNode}/${this.userService.currentUserId}`).put(imageBlob);
        this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot: any) => {
          console.log('snapshot:', snapshot);
        }, (error) => {
          console.log('uploadimage error', error);
        }, () => {
          resolve(this.uploadTask.snapshot);
        });
      });
  }

  saveFile(image) {
    let ref = this.afDB.object(`${this.rootNode}/${this.userService.currentUserId}`);
    return new Promise((resolve, reject) => {
      let data = {
        'url': image.downloadURL,
        'uid': image.metadata.name,
        'email': this.userService.currentUserEmail,
        'lastUpdated': new Date().getTime()
      };
      ref.update(data).then(() => {
        this.userService.updatePhotoUrlFromPlaceholder(image.downloadURL);
      }).catch(err => reject(err));
    });
  }


  pushUpload(upload: Upload) {
    let storageRef = firebase.storage().ref();
    this.uploadTask = storageRef.child(`${this.rootNode}/${this.userService.currentUserId}`).put(upload.file);
    this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot: any) => {
        upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log("PROGRESS:", upload.progress);
      }, (error) => {
        console.log("UPLOAD ERROR:", error)
      }, () => {
        upload.url = this.uploadTask.snapshot.downloadURL
        upload.name = upload.file.name
        this.saveFileNode(upload);
      });
  }

  private saveFileNode(upload: Upload) { 
    this.afDB.object(`${this.rootNode}/${this.userService.currentUserId}`).update(upload)
    .then(() => {
      this.userService.updatePhotoUrlFromPlaceholder(upload.url);
    });
  }

  deleteUpload() {
    this.userService.updatePhotoUrlToPlaceholder();
    this.deleteFileNode().then(() => {
      this.deleteFileStorage();
    })
    .catch(error => console.log("DELETE FILE STORAGE ERROR:", error))
  }

  deleteFileStorage() {
    let uid = this.userService.currentUserId;
    let storageRef = firebase.storage().ref();
    storageRef.child(`${this.rootNode}/${uid}`).delete();
  }

  deleteFileNode() {
    let uid = this.userService.currentUserId;
    return this.afDB.list(`${this.rootNode}`).remove(uid); 
 }

}
