import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddFriendPage } from '@ashy/pages/add-friend/add-friend';
import { IonicImageLoader } from 'ionic-image-loader';
import { StringInspector } from '@ashy/services/utility-service/string-inspector';


@NgModule({
  declarations: [
    AddFriendPage,
  ],
  imports: [
    IonicPageModule.forChild(AddFriendPage),
    IonicImageLoader
  ],
  providers: [
    StringInspector
  ]
})
export class AddFriendPageModule {}
