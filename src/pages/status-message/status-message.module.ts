import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '@ashy/pipes/pipes.module';
import { StatusMessagePage } from '@ashy/pages/status-message/status-message';

@NgModule({
  declarations: [
    StatusMessagePage,
  ],
  imports: [
    IonicPageModule.forChild(StatusMessagePage),
    PipesModule
  ],
})
export class StatusMessagePageModule {}
