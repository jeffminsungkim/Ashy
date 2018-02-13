import { Component } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { ImageLoaderConfig } from 'ionic-image-loader';

import { AngularFireAuth } from 'angularfire2/auth';
import { InterfaceOption } from '@ashy/services/interface-option/interface-option';
import { UserServiceProvider } from '@ashy/services/user-service/user-service';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: string;
  intervalId : number;

  constructor(
    platform: Platform,
    toastCtrl: ToastController,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    keyboard: Keyboard,
    afAuth: AngularFireAuth,
    interfaceOpt: InterfaceOption,
    userService: UserServiceProvider,
    imageLoaderConfig: ImageLoaderConfig) {

    platform.ready().then((readySource) => {
      afAuth.auth.onAuthStateChanged(user => {
        console.log("App User", user);

        if (user && user.displayName) {
          userService.getUserStatus().once('value').then((snapshot) => {
            const status = snapshot.val().currentActiveStatus;
            const userSignedIn = snapshot.val().usingApp;

            if (status && !userSignedIn || userSignedIn === undefined) {
              toastCtrl.create(interfaceOpt.makeShowToastOpt(`Signed in as ${user.email}`)).present();
              userService.updateCurrentUserAppUsageStatusTo(true, status);
            }
          });
          this.rootPage = 'HomePage';
        }
        else if (user && !user.emailVerified) {
          user.sendEmailVerification();
          this.intervalId = setInterval(() => {
            afAuth.auth.currentUser.reload().then(() => {
              console.log('Verification State:', user.emailVerified);
              if (user.emailVerified && !user.displayName) {
                clearInterval(this.intervalId);
                this.rootPage = 'ProfilePresetPage';
              }
            });
          }, 2000);
          this.rootPage = 'EmailVerificationPage';
        }
        else if (user && user.emailVerified && !user.displayName) {
          console.log('ProfilePresetPage');
          this.rootPage = 'ProfilePresetPage';
        }
        else {
          this.rootPage = 'WelcomePage';
          clearInterval(this.intervalId);
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

