import { Component } from '@angular/core';

import { UserPage } from '../user/user';
import { ChatPage } from '../chat/chat';
import { SettingPage } from '../setting/setting';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  firstTab = UserPage;
  secondTab = ChatPage
  lastTab = SettingPage;

  constructor() { }

}