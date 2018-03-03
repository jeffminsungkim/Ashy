import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '@ashy/pipes/pipes.module';
import { ProfileDetailPage } from '@ashy/pages/profile-detail/profile-detail';
import { UploadServiceProvider } from '@ashy/services/upload-service/upload-service';

@NgModule({
  declarations: [
    ProfileDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileDetailPage),
    PipesModule
  ],
  providers: [
    UploadServiceProvider,
  ]
})
export class ProfileDetailPageModule {}
