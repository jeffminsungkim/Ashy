import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { UploadServiceProvider } from '../../providers/upload-service/upload-service';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { User } from '../../models/User';
import { Upload } from '../../models/upload';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  private subscription: Subscription;
  private avatar: string;
  private displayName: string;
  private user$: Observable<any>;
  private emailVerified: boolean;
  private isUrlEqualsToPlaceholder: boolean;
  private selectedFile: FileList;
  private currentUpload: Upload;
  private previewImage: any;
  private user: any;

  constructor(
    public navParams: NavParams,
    public navCtrl: NavController,
    public events: Events,
    private authService: AuthServiceProvider,
    private userService: UserServiceProvider,
    private alertService: AlertServiceProvider,
    private uploadService: UploadServiceProvider) {
    this.emailVerified = navParams.get('emailVerified');
  }

  ionViewDidLoad() {
    console.log("Profile Page DidLoad()");
    // this.user$ = this.authService.currentUserObservable.subscribe((user) => console.log("IAM USER!", user));
    this.avatar = this.userService.currentUserPhotoURL;
    this.displayName = this.userService.currentUserDisplayName;
  }

  ionViewWillEnter() {
    console.log("Profile Page WillEnter()");
    this.subscription = this.userService.getLoggedInUser().subscribe((currentUser: any) => {
      for (let user of currentUser) {
        this.avatar = user.photoURL;
        this.displayName = user.displayName;
      }
    });
  }

  ionViewDidLeave() {
    console.log("Profile Page DidLeave()");
    // this.subscription.unsubscribe();
  }

  ionViewWillLeave() {
    console.log('Runs when the page is about to leave and no longer be the active page.');
    this.subscription.unsubscribe();
  }

  detectFiles(event) {
   this.selectedFile = event.target.files;
   if (this.selectedFile) {
     let reader = new FileReader();
     reader.onload = (event: any) => {
       this.previewImage = event.target.result;
        console.log("result:",this.previewImage );
     }
     reader.readAsDataURL(event.target.files[0]);
   }
 }

  deleteUploadFile() {
    if (this.selectedFile) {
      this.previewImage = this.avatar;
    } else {
      this.uploadService.deleteUpload();
    }
    
  }

  uploadSingleFile() {
    let file = this.selectedFile.item(0);
    this.currentUpload = new Upload(file);
    this.isUrlEqualsToPlaceholder = false;
    this.uploadService.pushUpload(this.currentUpload);
  }

  requestEmailVerification() {
    this.authService.sendEmailVerification();
    this.alertService.notifyVerificationEmailIsSent();
  }

  backToPreviousView() {
    this.navCtrl.pop();
  }

}