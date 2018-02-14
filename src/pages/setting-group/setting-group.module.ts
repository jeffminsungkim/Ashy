import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingGroupPage } from '@ashy/pages/setting-group/setting-group';

@NgModule({
  declarations: [
    SettingGroupPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingGroupPage),
  ],
})
export class SettingGroupPageModule {}
