import { NgModule, ModuleWithProviders } from '@angular/core';
import { LocalStorageServiceProvider } from '@ashy/services/local-storage-service/local-storage-service';
import { InterfaceOption } from '@ashy/services/interface-option//interface-option';
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
        LocalStorageServiceProvider,
        InterfaceOption,
        UtilityServiceProvider
      ]
    };
  }
}
