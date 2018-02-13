import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { TwitterConnect } from '@ionic-native/twitter-connect';

import { AuthServiceProvider } from "@ashy/services/auth-service/auth-service";
import { InterfaceOption } from '@ashy/services/interface-option//interface-option';
import { UserServiceProvider } from '@ashy/services/user-service/user-service';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private authService: AuthServiceProvider,
    private interfaceOpt: InterfaceOption,
    private twitterConnect: TwitterConnect,
    private userService: UserServiceProvider) {
  }

  loginWithTwitter() {
    let loader = this.loadingCtrl.create(this.interfaceOpt.makeWaitLoaderOpt());
    this.twitterConnect.login().then((res) => {
      loader.present();
      console.log('token:',res.token);
      console.log('secret:',res.secret);
      this.authService.twitterLogin(res.token, res.secret).then(user => {
        console.log('user test:', user);
        this.userService.updateCurrentUserActiveStatusTo('online');
        this.userService.updateCurrentUserAppUsageStatusTo(true, 'signout');
        this.navCtrl.setRoot('HomePage');
        loader.dismiss();
      }).catch(error => loader.dismiss());
    });
  }

  goToSignupPage() {
    this.navCtrl.push('SignupPage');
  }

  goToLoginPage() {
    this.navCtrl.push('LoginPage');
  }

}
