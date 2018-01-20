import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmailResetPage } from '@ashy-pages/email-reset/email-reset';

@NgModule({
  declarations: [
    EmailResetPage,
  ],
  imports: [
    IonicPageModule.forChild(EmailResetPage),
  ],
})
export class EmailResetPageModule {}
