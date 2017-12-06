import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NgProgressModule } from 'ngx-progressbar';
import { ProfilePage } from './profile';


@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    NgProgressModule,
    IonicPageModule.forChild(ProfilePage),
  ],
})
export class ProfilePageModule {}
