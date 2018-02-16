import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalWrapperPage } from '@ashy/pages/modal-wrapper/modal-wrapper';

@NgModule({
  declarations: [
    ModalWrapperPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalWrapperPage),
  ],
})
export class ModalWrapperPageModule {}
