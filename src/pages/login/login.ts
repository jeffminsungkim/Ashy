import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

import { AlertServiceProvider } from "@ashy-services/alert-service/alert-service";
import { AuthServiceProvider } from "@ashy-services/auth-service/auth-service";
import { UserServiceProvider } from "@ashy-services/user-service/user-service";
import { User } from "@ashy-models/user";

@IonicPage()
@Component({
	selector: "page-login",
	templateUrl: "login.html"
})
export class LoginPage {
	user = {} as User;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public alertService: AlertServiceProvider,
		public authService: AuthServiceProvider,
		public userService: UserServiceProvider) {}

	async login() {
		try {
			await this.authService.emailLogin(this.user);
			if (!this.userService.currentUserEmailVerified) {
				console.log('emailVerified:', this.userService.currentUserEmailVerified);
				this.authService.sendEmailVerification();
				this.authService.signOut();
				this.alertService.notifyToCheckVerificationEmail();
			} else {
				this.userService.getCurrentUserAppState().subscribe(state => {
					this.userService.updateEmailVerificationState(state.firstLogin);
					this.userService.updateFirstLoginState(state.firstLogin);
				});
			}
		} catch (err) {
			this.alertService.notifyErrorMessage(err.message);
		}
	}
	goToPasswordReset() {
		this.navCtrl.push('PasswordResetPage');
	}
			} else {
				this.userService.getCurrentUserAppState().subscribe(state => {
					this.userService.updateEmailVerificationState(state.firstLogin);
					this.userService.updateFirstLoginState(state.firstLogin);
				});

	goToRegister() {
		this.navCtrl.push('RegisterPage');
	}
}
