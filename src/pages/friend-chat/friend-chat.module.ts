import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FriendChatPage } from '@ashy/pages/friend-chat/friend-chat';
import { ChatServiceProvider } from '@ashy/services/chat-service/chat-service';
import { EmojiPickerComponentModule } from "@ashy/components/emoji-picker/emoji-picker.module";
import { EmojiServiceProvider } from "@ashy/services/emoji-service/emoji-service";
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
    ChatServiceProvider,
    EmojiServiceProvider
  ]
})
export class FriendChatPageModule {}
