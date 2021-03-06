import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingPage } from '@ashy/pages/setting/setting';
import { IonicImageLoader } from 'ionic-image-loader';
import { UploadServiceProvider } from '@ashy/services/upload-service/upload-service';


@NgModule({
  declarations: [
    SettingPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingPage),
    IonicImageLoader
  ],
  providers: [
    UploadServiceProvider
  ]
})
export class SettingPageModule {}
