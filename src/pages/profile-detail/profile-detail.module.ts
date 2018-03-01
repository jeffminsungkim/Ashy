import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SimpleRelativeTimePipe } from '@ashy/pipes/simple-relative-time/simple-relative-time';
import { ProfileDetailPage } from '@ashy/pages/profile-detail/profile-detail';
import { UploadServiceProvider } from '@ashy/services/upload-service/upload-service';

@NgModule({
  declarations: [
    ProfileDetailPage,
    SimpleRelativeTimePipe
  ],
  imports: [
    IonicPageModule.forChild(ProfileDetailPage),
  ],
  providers: [
    UploadServiceProvider,
  ]
})
export class ProfileDetailPageModule {}
