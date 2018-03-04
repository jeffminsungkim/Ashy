import { Component, ViewChild } from '@angular/core';
import { LowerCasePipe } from '@angular/common';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { FormControl, Validators } from '@angular/forms';
import { UserServiceProvider } from '@ashy/services/user-service/user-service';


@IonicPage()
@Component({
  selector: 'page-displayname',
  templateUrl: 'displayname.html',
})
export class DisplaynamePage {
  @ViewChild('inputBox') inputBox;
  title: string = 'Name';
  smControl: FormControl;
  pristineName: string;
  newName: string;
  showCloseBtn: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private events: Events,
    private userService: UserServiceProvider) {
    this.showCloseBtn = navParams.get('showCloseBtn');
    this.pristineName = navParams.get('displayName');
    this.newName = this.pristineName;
    this.createFormGroup();
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.inputBox.setFocus();
    }, 600);
  }

  createFormGroup() {
    this.smControl = new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]);
  }

  saveModification({ value, valid }: { value: string, valid: boolean}) {
    console.log('saveModification value:', value);
    console.log('saveModification valid:', valid);
    if (valid) {
      // TODO: Write an HTTP call
      this.dismissModal();
    }
  }

  updateTypedWord() {
    this.newName = this.inputBox.value;
  }

  ionViewWillLeave() {
    this.events.publish('displayName', this.newName);
  }

  dismissModal() {
    this.viewCtrl.dismiss();
  }

}
