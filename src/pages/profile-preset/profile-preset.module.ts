import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePresetPage } from '@ashy/pages/profile-preset/profile-preset';
import { UploadServiceProvider } from '@ashy/services/upload-service/upload-service';


@NgModule({
  declarations: [
    ProfilePresetPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePresetPage),
  ],
  providers: [
    UploadServiceProvider
  ]
})
export class ProfilePresetPageModule {}
