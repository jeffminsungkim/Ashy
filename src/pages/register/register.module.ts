import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistrationFormModule } from '@ashy/components/registration-form//registration-form.module';
import { RegisterPage } from '@ashy/pages/register/register';

@NgModule({
  declarations: [
    RegisterPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterPage),
    RegistrationFormModule
  ],
})
export class RegisterPageModule {}
