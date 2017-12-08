import { Component } from '@angular/core';
import { IonicPage, Events } from 'ionic-angular';

import { UserServiceProvider } from '../../providers/user-service/user-service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  firstTab: string = 'FriendPage';
  secondTab: string = 'ChatPage';
  thirdTab: string = 'NotificationPage';
  lastTab: string = 'SettingPage';
  totalRequests: string;

  constructor(public events: Events, private userService: UserServiceProvider) {
    this.events.subscribe('totalRequests:arrived', (totalRequests) => {
      if (totalRequests > 0)
        this.totalRequests = totalRequests;
      else
        this.totalRequests = '';
    });
  }
}