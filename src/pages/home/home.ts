import { Component } from '@angular/core';
import { IonicPage, Events } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';

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
  newFriends: string;
  addedFriend: number = 0;

  constructor(public events: Events, private userService: UserServiceProvider) {


    this.events.subscribe('totalRequests:arrived', (totalRequests) => {
      if (totalRequests > 0)
        this.totalRequests = totalRequests;
      else
        this.totalRequests = '';
    });

    this.events.subscribe('newFriend:added', (newFriends) => {
      console.log('New Friend', newFriends);
      if (newFriends > 0) {
        this.newFriends = this.addedFriend + newFriends;
        this.addedFriend += newFriends;
      }
      
      setTimeout(() => {
        this.newFriends = '';
        this.addedFriend = 0;
      }, 20000);
    });
  }

  ionViewDidLeave(){
    this.events.unsubscribe('totalRequests:arrived');
    this.events.unsubscribe('newFriend:added');
  }
}