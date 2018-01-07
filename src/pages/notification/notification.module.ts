import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationPage } from '@ashy-pages/notification/notification';
import { PipesModule } from '@ashy-pipes/pipes.module';

@NgModule({
  declarations: [
    NotificationPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(NotificationPage),
  ],
})
export class NotificationPageModule {}
