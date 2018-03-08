import { Component, OnInit, ViewChild } from '@angular/core';
import { LowerCasePipe } from '@angular/common';
import { IonicPage, NavParams, ViewController, Events } from 'ionic-angular';
import { FormControl, Validators } from '@angular/forms';
import { UserServiceProvider } from '@ashy/services/user-service/user-service';


@IonicPage()
@Component({
  selector: 'page-displayname',
  templateUrl: 'displayname.html',
})
export class DisplaynamePage implements OnInit {
  @ViewChild('inputBox') displayNameInput;
  displayNameControl: FormControl;
  title: string;
  pristineName: string;
  newDisplayName: string;
  showCloseBtn: boolean;

  constructor(
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private events: Events,
    private userService: UserServiceProvider) {

    this.showCloseBtn = navParams.get('showCloseBtn');
    this.pristineName = navParams.get('displayName');
    this.title = 'Name';
    this.newDisplayName = '';
  }

  ionViewDidLoad() { this.initInputForm(); }

  ngOnInit() { this.createDisplaynameForm(); }

  initInputForm() {
    this.displayNameInput.value = this.pristineName;
    setTimeout(() => {
      this.displayNameInput.setFocus();
    }, 600);
  }

  createDisplaynameForm() {
    this.displayNameControl = new FormControl('', [Validators.required, Validators.maxLength(20)]);
  }

  saveModification({ value, valid }: { value: string, valid: boolean}) {
    console.log('saveModification value:', value);
    console.log('saveModification valid:', valid);
    if (valid) {
      // this.newDisplayName = value;

      // TODO: Write an HTTP call

      this.dismissModal();
    }
  }

  get displayName() { return this.displayNameControl; }

  ionViewWillLeave() {
    if (this.newDisplayName !== '') this.events.publish('displayName', this.newDisplayName);
  }

  dismissModal() { this.viewCtrl.dismiss(); }

}
