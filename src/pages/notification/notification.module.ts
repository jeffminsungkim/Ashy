import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationPage } from '@ashy/pages/notification/notification';
import { PipesModule } from '@ashy/pipes/pipes.module';
import { ReversePipe } from 'ngx-pipes';

@NgModule({
  declarations: [
    NotificationPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(NotificationPage),
  ],
  providers: [
    ReversePipe
  ]
})
export class NotificationPageModule {}
