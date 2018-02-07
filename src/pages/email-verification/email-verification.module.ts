import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmailVerificationPage } from '@ashy/pages/email-verification/email-verification';

@NgModule({
  declarations: [
    EmailVerificationPage,
  ],
  imports: [
    IonicPageModule.forChild(EmailVerificationPage),
  ],
})
export class EmailVerificationPageModule {}
