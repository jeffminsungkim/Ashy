import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmailPage } from '@ashy/pages/email/email';
import { SingleEmailFormModule } from '@ashy/components/single-email-form/single-email-form.module';

@NgModule({
  declarations: [
    EmailPage,
  ],
  imports: [
    IonicPageModule.forChild(EmailPage),
    SingleEmailFormModule
  ],
})
export class EmailPageModule {}
