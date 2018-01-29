import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TwitterConnect } from '@ionic-native/twitter-connect';

import { AuthServiceProvider } from "@ashy-services/auth-service/auth-service";
import { LoadingServiceProvider } from '@ashy-services/loading-service/loading-service';
import { UserServiceProvider } from '@ashy-services/user-service/user-service';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthServiceProvider,
    private loadingService: LoadingServiceProvider,
    private twitterConnect: TwitterConnect,
    private userService: UserServiceProvider) {
  }

  loginWithTwitter() {
    this.twitterConnect.login().then((res) => {
      this.loadingService.showWaitLoader();
      console.log('token:',res.token);
      console.log('secret:',res.secret);
      this.authService.twitterLogin(res.token, res.secret).then(user => {
        console.log('user test:', user);
        this.userService.updateCurrentUserActiveStatusTo('online');
        this.userService.updateCurrentUserAppUsageStatusTo(true, 'signout');
        this.navCtrl.setRoot('HomePage');
        this.loadingService.dismiss();
      }).catch(error => this.loadingService.dismiss());
    });
  }

  goToRegisterPage() {
    this.navCtrl.push('RegisterPage');
  }

  goToLoginPage() {
    this.navCtrl.push('LoginPage');
  }

}
