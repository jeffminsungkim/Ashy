import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from '@ashy/pages/profile/profile';
import { ChatServiceProvider } from '@ashy/services/chat-service/chat-service';
import { UploadServiceProvider } from '@ashy/services/upload-service/upload-service';

@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),
  ],
  providers: [
    ChatServiceProvider,
    UploadServiceProvider
  ]
})
export class ProfilePageModule {}
