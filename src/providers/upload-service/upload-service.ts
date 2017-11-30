import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';

import * as firebase from 'firebase/app';
import 'firebase/storage';

import { UserServiceProvider } from '../user-service/user-service';
import { ModalServiceProvider } from '../modal-service/modal-service';

import { Upload } from '../../models/upload';

@Injectable()
export class UploadServiceProvider {
  private rootNode: string = 'profilepics';
  private uploadTask: firebase.storage.UploadTask;
  private placeHolderImageURL: string;

  constructor(
    private afDB: AngularFireDatabase, 
    private userService: UserServiceProvider,
    private modalService: ModalServiceProvider) {
    this.placeHolderImageURL = 'https://firebasestorage.googleapis.com/v0/b/chattycherry-3636c.appspot.com/o/user-default.png?alt=media&token=f85be639-9a1c-4c79-a28d-361171358a41';
  }

  pushUpload(upload: Upload) {
    let storageRef = firebase.storage().ref();
    this.uploadTask = storageRef.child(`${this.rootNode}/${this.userService.currentUserId}`).put(upload.file);
    this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot: any) => {
        upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      }, (error) => {
        console.log("UPLOAD ERROR:", error)
      }, () => {
        upload.url = this.uploadTask.snapshot.downloadURL
        upload.name = upload.file.name
        this.saveFileNode(upload)
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
