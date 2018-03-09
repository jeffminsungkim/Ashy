import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmailPage } from '@ashy/pages/email/email';



@NgModule({
  declarations: [
    EmailPage,
  ],
  imports: [
    IonicPageModule.forChild(EmailPage),
  ],
})
export class EmailPageModule {}
