import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastServiceProvider } from '../providers/toast-service/toast-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: string;

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen, 
    afAuth: AngularFireAuth,
    toastService: ToastServiceProvider) {

    platform.ready().then((readySource) => {
      afAuth.auth.onAuthStateChanged(user => {
        console.log("App User", user);
        if (user && user.emailVerified) {
          this.rootPage = 'HomePage';
          toastService.show(`Signed in as ${user.email}`);
        } else {
          this.rootPage = 'LoginPage';
        }
      });

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      console.log('Platform ready from', readySource);
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

