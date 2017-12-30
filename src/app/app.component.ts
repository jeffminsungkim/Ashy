import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';

import { AngularFireAuth } from 'angularfire2/auth';
import { ToastServiceProvider } from '../providers/toast-service/toast-service';
import { UserServiceProvider } from '../providers/user-service/user-service';

import 'rxjs/add/operator/take';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: string;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    keyboard: Keyboard,
    afAuth: AngularFireAuth,
    toastService: ToastServiceProvider,
    userService: UserServiceProvider) {

    platform.ready().then((readySource) => {
      afAuth.auth.onAuthStateChanged(user => {
        console.log("App User", user);
        if (user && user.emailVerified) {
           userService.getUserActiveStatus().take(1).subscribe(status => {
             if (status === 'online') {
               toastService.show(`Signed in as ${user.email}`);
               userService.updateCurrentUserActiveStatusTo('online');
             }
           });
          this.rootPage = 'HomePage';
        } else {
          this.rootPage = 'LoginPage';
        }
      });

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      console.log('Platform ready from', readySource);
      statusBar.styleDefault();
      splashScreen.hide();
      if (platform.is('ios'))
        keyboard.disableScroll(true);
    });
  }
}

