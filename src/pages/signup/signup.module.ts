import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistrationFormModule } from '@ashy/components/registration-form/registration-form.module';
import { SignupPage } from '@ashy/pages/signup/signup';

@NgModule({
  declarations: [
    SignupPage,
  ],
  imports: [
    IonicPageModule.forChild(SignupPage),
    RegistrationFormModule
  ],
})
export class SignupPageModule {}
