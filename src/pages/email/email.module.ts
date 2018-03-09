import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmailPage } from '@ashy/pages/email/email';
import { ValidationServiceProvider } from '@ashy/services/validation-service/validation-service';


@NgModule({
  declarations: [
    EmailPage,
  ],
  imports: [
    IonicPageModule.forChild(EmailPage),
  ],
  providers: [
    ValidationServiceProvider
  ]
})
export class EmailPageModule {}
