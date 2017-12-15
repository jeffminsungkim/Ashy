import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FriendPage } from './friend';

import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    FriendPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(FriendPage),
  ],
})
export class FriendPageModule {}
