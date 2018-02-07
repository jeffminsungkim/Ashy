import { NgModule, ModuleWithProviders } from '@angular/core';
import { AlertServiceProvider } from '@ashy/services/alert-service/alert-service';
import { LoadingServiceProvider } from '@ashy/services/loading-service/loading-service';
import { ModalServiceProvider } from '@ashy/services/modal-service/modal-service';
import { ToastServiceProvider } from '@ashy/services/toast-service/toast-service';
import { UtilityServiceProvider } from '@ashy/services/utility-service/utility-service';


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
