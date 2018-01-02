import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatPage } from './chat';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    ChatPage
  ],
  imports: [
    IonicPageModule.forChild(ChatPage),
    IonicImageLoader
  ],
})
export class ChatPageModule {}
