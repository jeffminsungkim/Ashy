import { Component, OnInit, ViewChild } from '@angular/core';
import { LowerCasePipe } from '@angular/common';
import { IonicPage, ViewController, NavParams, Events } from 'ionic-angular';
import { FormControl, Validators } from '@angular/forms';
import { UserServiceProvider } from '@ashy/services/user-service/user-service';


@IonicPage()
@Component({
  selector: 'page-status-message',
  templateUrl: 'status-message.html',
})
export class StatusMessagePage implements OnInit {
  @ViewChild('inputBox') statusMessageInput;
  statusMessageControl: FormControl;
  title: string;
  newSm: string;
  showCloseBtn: boolean;

  constructor(
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private events: Events,
    private userService: UserServiceProvider) {

    this.showCloseBtn = navParams.get('showCloseBtn');
    this.title = 'Status Message';
    this.newSm = '';
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.statusMessageInput.setFocus();
    }, 600);
  }

  ngOnInit() { this.createStatusMessageForm(); }

  createStatusMessageForm() {
    this.statusMessageControl = new FormControl('', [Validators.required, Validators.maxLength(60)]);
  }

  saveModification({ value, valid }: { value: string, valid: boolean}) {
    if (valid) {
      this.newSm = value;
      this.userService.updateStatusMessage(this.newSm);
      this.dismissModal();
    }
  }

  get statusMessage() { return this.statusMessageControl; }

  ionViewWillLeave() {
    if (this.newSm !== '') this.events.publish('statusMessage', this.newSm);
  }

  dismissModal() { this.viewCtrl.dismiss(); }

}
