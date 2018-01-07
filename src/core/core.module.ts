import { NgModule, ModuleWithProviders } from '@angular/core';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { UserServiceProvider } from '../providers/user-service/user-service';


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