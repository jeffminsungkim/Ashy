import { Component } from '@angular/core';
import { IonicPage, Events } from 'ionic-angular';

import { UserServiceProvider } from '@ashy/services/user-service/user-service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  firstTab: string = 'FriendPage';
  secondTab: string = 'ChatPage';
  thirdTab: string = 'RandomPage';
  lastTab: string = 'NotificationPage';
  totalRequests: string;
  newFriends: string;
  addedFriend: number = 0;

  constructor(public events: Events, public userService: UserServiceProvider) {

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
