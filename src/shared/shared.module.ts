import { NgModule, ModuleWithProviders } from '@angular/core';
import { AlertServiceProvider } from '../providers/alert-service/alert-service';
import { ChatServiceProvider } from '../providers/chat-service/chat-service';
import { ModalServiceProvider } from '../providers/modal-service/modal-service';
import { ToastServiceProvider } from '../providers/toast-service/toast-service';
import { UserServiceProvider } from '../providers/user-service/user-service';


@NgModule({
  declarations: [],
  imports: [],
  exports: []
})

export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        AlertServiceProvider,
        ChatServiceProvider,
        ModalServiceProvider,
        ToastServiceProvider,
        UserServiceProvider
      ]
    };
  }
}