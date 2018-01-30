import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddFriendPage } from '@ashy-pages/add-friend/add-friend';
import { IonicImageLoader } from 'ionic-image-loader';


@NgModule({
  declarations: [
    AddFriendPage,
  ],
  imports: [
    IonicPageModule.forChild(AddFriendPage),
    IonicImageLoader
  ],
})
export class AddFriendPageModule {}
