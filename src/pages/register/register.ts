import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { SettingPage } from '../setting/setting';

import { UserServiceProvider } from '../../providers/user-service/user-service';

import { User } from '../../models/user';


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  user: User = {
    email: '',
    password: '',
    displayName: '',
    gender: ''
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private userService: UserServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  onSubmit({value, valid}: {value: User, valid: boolean}) {
    console.log("register value", value);
    let toast = this.toastCtrl.create({
      duration: 3000,
      message: 'All fields are required.'
    });
    if (!valid) {
      toast.present();
    } else {
      let loader = this.loadingCtrl.create({ content: 'Please wait. . .'});
      loader.present();

      this.userService.emailSignUp(value).then((res) => {
        if (res) 
          this.navCtrl.setRoot(LoginPage);
        loader.dismiss();
      })
      .catch((err) => {
        loader.dismiss();
        this.toastCtrl.create({
          duration: 4000,
          message: err
        });
      });
      
    }
  }

  goBack() {
    this.navCtrl.pop();
  }
}
