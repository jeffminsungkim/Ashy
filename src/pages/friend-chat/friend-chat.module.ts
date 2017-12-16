import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FriendChatPage } from './friend-chat';

@NgModule({
  declarations: [
    FriendChatPage,
  ],
  imports: [
    IonicPageModule.forChild(FriendChatPage),
  ],
})
export class FriendChatPageModule {}
