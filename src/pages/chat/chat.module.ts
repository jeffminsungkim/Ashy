import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatPage } from '@ashy-pages/chat/chat';
import { ChatServiceProvider } from '@ashy-services/chat-service/chat-service';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    ChatPage
  ],
  imports: [
    IonicPageModule.forChild(ChatPage),
    IonicImageLoader
  ],
  providers: [
    ChatServiceProvider
  ]
})
export class ChatPageModule {}
