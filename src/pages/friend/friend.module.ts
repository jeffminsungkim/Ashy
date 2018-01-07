import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FriendPage } from '@ashy-pages/friend/friend';
import { ComponentsModule } from '@ashy-components/components.module';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    FriendPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(FriendPage),
    IonicImageLoader
  ],
})
export class FriendPageModule {}
