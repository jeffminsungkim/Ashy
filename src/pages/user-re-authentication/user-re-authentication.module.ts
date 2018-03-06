import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserReAuthenticationPage } from '@ashy/pages/user-re-authentication/user-re-authentication';


@NgModule({
  declarations: [
    UserReAuthenticationPage,
  ],
  imports: [
    IonicPageModule.forChild(UserReAuthenticationPage),
  ],
})
export class UserReAuthenticationPageModule {}
