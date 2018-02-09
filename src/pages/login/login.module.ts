import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistrationFormModule } from '@ashy/components/registration-form//registration-form.module';
import { LoginPage } from '@ashy/pages/login/login';


@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
    RegistrationFormModule,
  ],
})
export class LoginPageModule {}
