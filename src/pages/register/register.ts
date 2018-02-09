import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController } from "ionic-angular";
import { RegistrationFormComponent } from "@ashy/components/registration-form/registration-form";


@IonicPage()
@Component({
  selector: "page-register",
  templateUrl: "register.html"
})
export class RegisterPage {

  @ViewChild(RegistrationFormComponent) registrationForm: RegistrationFormComponent;

  constructor(public navCtrl: NavController) {}

  ionViewDidEnter() {
    this.registrationForm.changeSumitButtonLabelTo('Sign In');
    this.registrationForm.handleDynamicSubmitFunc('signup');
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.registrationForm.emailInput.setFocus();
    }, 600);
  }

  backToRoot() { this.navCtrl.pop(); }
}
