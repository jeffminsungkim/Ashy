import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePresetPage } from './profile-preset';

@NgModule({
  declarations: [
    ProfilePresetPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePresetPage),
  ],
})
export class ProfilePresetPageModule {}
