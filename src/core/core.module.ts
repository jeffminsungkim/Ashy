import { NgModule, ModuleWithProviders } from '@angular/core';
import { AuthServiceProvider } from '@ashy-services/auth-service/auth-service';
import { UserServiceProvider } from '@ashy-services/user-service/user-service';


@NgModule({
  declarations: [],
  imports: [],
  exports: []
})

export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        AuthServiceProvider,
        UserServiceProvider
      ]
    };
  }
}