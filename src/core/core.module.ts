import { NgModule, ModuleWithProviders } from '@angular/core';
import { AuthServiceProvider } from '@ashy-services/auth-service/auth-service';
import { UserServiceProvider } from '@ashy-services/user-service/user-service';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { ENV } from '@ashy-env';


@NgModule({
  declarations: [],
  imports: [
    AngularFireModule.initializeApp(ENV.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule
  ],
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
