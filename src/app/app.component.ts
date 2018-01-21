import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { ImageLoaderConfig } from 'ionic-image-loader';

import { AngularFireAuth } from 'angularfire2/auth';
import { ToastServiceProvider } from '@ashy-services/toast-service/toast-service';
import { UserServiceProvider } from '@ashy-services/user-service/user-service';


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
    userService: UserServiceProvider,
    imageLoaderConfig: ImageLoaderConfig) {

    platform.ready().then((readySource) => {
      afAuth.auth.onAuthStateChanged(user => {
        console.log("App User", user);
        if (user && user.emailVerified && user.displayName) {
          userService.getUserStatus().once('value').then((snapshot) => {
            const status = snapshot.val().currentActiveStatus;
            const userSignedIn = snapshot.val().usingApp;

            if (!userSignedIn || userSignedIn === undefined) {
              toastService.show(`Signed in as ${user.email}`);
              userService.updateCurrentUserAppUsageStatusTo(true, status);
            }
          });
          this.rootPage = 'HomePage';
        }
        else if (user && !user.emailVerified || user && !user.displayName) {
          this.rootPage = 'EmailVerificationPage';
        }
        else {
          this.rootPage = 'LoginPage'; // TODO: Switch Weclome page
        }
      });

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      console.log('Platform ready from', readySource);
      keyboard.disableScroll(true);
      statusBar.styleDefault();
      splashScreen.hide();
      imageLoaderConfig.enableSpinner(false);
      imageLoaderConfig.useImageTag(true);
      imageLoaderConfig.setMaximumCacheSize(20 * 1024 * 1024); // set max size to 20MB
    });
  }
}

