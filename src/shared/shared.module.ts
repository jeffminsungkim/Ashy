import { NgModule, ModuleWithProviders } from '@angular/core';
import { AlertServiceProvider } from '../providers/alert-service/alert-service';
import { LoadingServiceProvider } from '../providers/loading-service/loading-service';
import { ModalServiceProvider } from '../providers/modal-service/modal-service';
import { ToastServiceProvider } from '../providers/toast-service/toast-service';
import { UtilityServiceProvider } from '../providers/utility-service/utility-service';


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
        LoadingServiceProvider,
        ModalServiceProvider,
        ToastServiceProvider,
        UtilityServiceProvider
      ]
    };
  }
}