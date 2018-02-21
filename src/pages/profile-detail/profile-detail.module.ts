import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RelativeTimePipe } from '@ashy/pipes/relative-time/relative-time';
import { ProfileDetailPage } from '@ashy/pages/profile-detail/profile-detail';
import { UploadServiceProvider } from '@ashy/services/upload-service/upload-service';

@NgModule({
  declarations: [
    ProfileDetailPage,
    RelativeTimePipe
  ],
  imports: [
    IonicPageModule.forChild(ProfileDetailPage),
  ],
  providers: [
    UploadServiceProvider,
  ]
})
export class ProfileDetailPageModule {}
