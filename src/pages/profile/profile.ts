import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

import { NgProgress } from 'ngx-progressbar';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { UploadServiceProvider } from '../../providers/upload-service/upload-service';
import { ModalServiceProvider } from '../../providers/modal-service/modal-service';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { User } from '../../models/User';
import { Upload } from '../../models/upload';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage implements OnDestroy {
  private subscription: Subscription;
  private avatar: string;
  private displayName: string;
  private previewImage: any;

  constructor(
    public navParams: NavParams,
    public navCtrl: NavController,
    private nativePageTransitions: NativePageTransitions,
    private ngProgress: NgProgress,
    private authService: AuthServiceProvider,
    private userService: UserServiceProvider,
    private alertService: AlertServiceProvider,
    private uploadService: UploadServiceProvider,
    private modalService: ModalServiceProvider) {
  }

  ionViewDidLoad() {
    console.log("Profile Page DidLoad()");
    // this.user$ = this.authService.currentUserObservable.subscribe((user) => console.log("IAM USER!", user));
    this.avatar = this.userService.currentUserPhotoURL;
    this.displayName = this.userService.currentUserDisplayName;
  }

  ionViewWillEnter() {
    this.subscription = this.userService.getCurrentUser().subscribe((user: any) => {
      this.avatar = user.photoURL;
      this.displayName = user.displayName;
    });
  }

  ngOnDestroy() {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
      console.log("Profile ngOnDestroy");
    }
  }

  showOriginalImage() {
    console.log("showOriginalImage()");

  }
  
  editProfile() {
    this.modalService.showProfileDetailModal();
  }

  backToPreviousView() {
    this.navCtrl.pop();
  }

}