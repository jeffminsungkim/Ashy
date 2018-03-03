import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '@ashy/pipes/pipes.module';
import { DisplaynamePage } from '@ashy/pages/displayname/displayname';

@NgModule({
  declarations: [
    DisplaynamePage,
  ],
  imports: [
    IonicPageModule.forChild(DisplaynamePage),
    PipesModule
  ],
})
export class DisplaynamePageModule {}
