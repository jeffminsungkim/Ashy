import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  firstTab: string = 'UserPage';
  secondTab: string = 'ChatPage';
  lastTab: string = 'SettingPage';

  constructor() { }

}