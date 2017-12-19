import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FriendChatPage } from './friend-chat';
import { RelativeTimePipe } from '../../pipes/relative-time/relative-time';
import { EmojiPickerComponentModule } from "../../components/emoji-picker/emoji-picker.module";
import { EmojiServiceProvider } from "../../providers/emoji-service/emoji-service";

@NgModule({
  declarations: [
    FriendChatPage,
    RelativeTimePipe
  ],
  imports: [
    EmojiPickerComponentModule,
    IonicPageModule.forChild(FriendChatPage),
  ],
  providers:[
    EmojiServiceProvider
  ]
})
export class FriendChatPageModule {}
