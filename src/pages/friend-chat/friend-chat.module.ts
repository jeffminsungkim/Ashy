import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FriendChatPage } from './friend-chat';
import { EmojiPickerComponentModule } from "../../components/emoji-picker/emoji-picker.module";
import { EmojiServiceProvider } from "../../providers/emoji-service/emoji-service";
import { ElasticModule } from 'ng-elastic';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    FriendChatPage
  ],
  imports: [
    EmojiPickerComponentModule,
    IonicPageModule.forChild(FriendChatPage),
    ElasticModule,
    IonicImageLoader
  ],
  providers:[
    EmojiServiceProvider
  ]
})
export class FriendChatPageModule {}
