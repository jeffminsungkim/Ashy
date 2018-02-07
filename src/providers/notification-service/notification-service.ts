import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FCM } from '@ionic-native/fcm';

@Injectable()
export class NotificationServiceProvider {

  constructor(public http: HttpClient, private fcm: FCM) {

  }

  registerFCMToken(uid: string) {
    this.fcm.subscribeToTopic('all');
    this.fcm.getToken().then(token => {
      console.log('getToken()', token);
      // userService.updateNotificationToken(token, uid);
    });
    this.fcm.onNotification().subscribe(data => {
      alert('message received')
      if (data.wasTapped) {
        console.info("Received in background");
      } else {
        console.info("Received in foreground");
      };
    });
    this.fcm.onTokenRefresh().subscribe(token => {
      console.log('onTokenRefresh()', token);
      // userService.updateNotificationToken(token, user.uid);
    });
  }

}
