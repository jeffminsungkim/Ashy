import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Events, Platform, ModalController } from 'ionic-angular';

import { UserServiceProvider } from '@ashy/services/user-service/user-service';
import { AuthServiceProvider } from '@ashy/services/auth-service/auth-service';
import { ModalServiceProvider } from '@ashy/services/modal-service/modal-service';
import { LocalStorageServiceProvider } from '@ashy/services/local-storage-service/local-storage-service';
import { User } from '@ashy/models/user';

import * as jdenticon from 'jdenticon';

import { Observable } from 'rxjs/Observable';
import { EmptyObservable } from 'rxjs/observable/EmptyObservable';
import { interval } from 'rxjs/observable/interval';
import { Subscription } from 'rxjs/Subscription';
import { of } from 'rxjs/observable/of';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { tap, map, take, switchMap } from 'rxjs/operators';


@IonicPage()
@Component({
  selector: 'page-friend',
  templateUrl: 'friend.html',
})
export class FriendPage {
  @ViewChild('avatarHolder') avatarHolder: ElementRef;
  subscription: Subscription;
  friends$: Observable<User[]>;
  me$: Observable<User>;
  me: User;
  thumbnailURL: string;
  identicon: string;
  identiconHash: string;
  identiconElemRef: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    public elementRef: ElementRef,
    public events: Events,
    public platform: Platform,
    private localStorageService: LocalStorageServiceProvider,
    public userService: UserServiceProvider,
    public authService: AuthServiceProvider,
    public modalService: ModalServiceProvider) {

    this.me$ = this.userService.getCurrentUser();
  }

  // getRequestFromUser() {
  //   this.subscription = this.userService.fetchFriendRequest().subscribe((req: any) => {
  //     for (let sender of req)
  //       this.uid = sender.uid;
  //     console.log("GET REQUEST FROM FOLLOWING UID", this.uid);
  //     if (this.uid !== this.userService.currentUserId && this.uid !== undefined)
  //       this.events.publish('totalRequests:arrived', req.length);
  //   });
  // }

  ionViewWillEnter() {
    console.log("friends ionViewWillEnter");
    this.retrieveHash();
    this.getUserProfile();
    this.getMyFriendList();
    // this.getRequestFromUser();
  }

  ionViewWillLeave() {
    console.log("friends ionViewWillLeave");
    if (this.subscription !== undefined) this.subscription.unsubscribe();
  }

  retrieveHash() {
    this.localStorageService.getIdenticonHash().subscribe(hash => this.identiconHash = hash);
  }

  setIdenticon() {
    if (this.identiconHash) {
      let width = 30;
      let height = 30;
      let svg = jdenticon.toSvg(this.identiconHash, Math.min(width, height));
      this.identicon = "data:image/svg+xml," + encodeURIComponent(svg);
      this.avatarHolder.nativeElement.src = this.identicon;
    }
  }

  getMyFriendList() {
    this.friends$ = this.userService.getMyFriendsId().switchMap(friendKeys => {
      console.log('friendKeyList:', friendKeys);
      return friendKeys.length === 0 ? of(friendKeys) :
      combineLatest(friendKeys.map(user => this.userService.getFriends(user.key)));
    });
  }

  getUserProfile() {
    this.subscription = this.me$.subscribe(user => {
      this.me = user;
      this.thumbnailURL = user.thumbnailURL;
      if (this.thumbnailURL === null) setTimeout(() => {this.setIdenticon();}, 1000);
    });
  }

  deleteUserFromFriendList(user) {
    this.userService.removeUserFromFriendList(user.uid);
  }

  showOriginalAvatarImage() {
    console.log("showOriginalAvatarImage()");
  }

  showQuickSetting() {
    this.rotateCogAnimation();
    let settingGroup = this.modalCtrl.create('SettingGroupPage', { user: this.me, identicon: this.identicon });
    settingGroup.onDidDismiss(() => {

    });
    settingGroup.present();
  }

  private rotateCogAnimation() {
    let rotate = document.querySelector('.rotate');
    rotate.classList.toggle('fa-rotate-180');
  }

  addFriend() {
    this.modalService.showAddFriendModal(this.me);
  }

  viewMyProfile() {
    console.log('view my profile:', this.me);
  }

  viewUserProfile(user: User) {
    console.log('view user profile:', user);
  }
}
