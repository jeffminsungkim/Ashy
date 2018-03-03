import { Component, ViewChild } from '@angular/core';
import { LowerCasePipe } from '@angular/common';
import { IonicPage, NavController, ViewController, NavParams, Events } from 'ionic-angular';
import { FormControl, Validators } from '@angular/forms';
import { UserServiceProvider } from '@ashy/services/user-service/user-service';


@IonicPage()
@Component({
  selector: 'page-status-message',
  templateUrl: 'status-message.html',
})
export class StatusMessagePage {
  @ViewChild('inputBox') inputBox;
  title: string = 'Status Message';
  smControl: FormControl;
  newSm: string = '';
  showCloseBtn: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private events: Events,
    private userService: UserServiceProvider) {

    this.showCloseBtn = navParams.get('showCloseBtn');
    this.createFormGroup();
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.inputBox.setFocus();
    }, 600);
  }

  createFormGroup() {
    this.smControl = new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(60)]);
  }

  saveModification({ value, valid }: { value: string, valid: boolean}) {

    if (valid) {
      this.userService.updateStatusMessage(value);
      this.dismissModal();
    }
  }

  updateTypedWord() {
    this.newSm = this.inputBox.value;
  }

  ionViewWillLeave() {
    this.events.publish('statusMessage', this.newSm);
  }

  dismissModal() {
    this.viewCtrl.dismiss();
  }





}
