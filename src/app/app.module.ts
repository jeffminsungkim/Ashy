import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AsyncLocalStorageModule } from 'angular-async-local-storage';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { Keyboard } from '@ionic-native/keyboard';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { IonicImageLoader } from 'ionic-image-loader';

import { MyApp } from '@ashy/app/app.component';
import { CoreModule } from '@ashy/core/core.module';
import { SharedModule } from '@ashy/shared/shared.module';

import { LocalStorageServiceProvider } from '@ashy/services/local-storage-service/local-storage-service';


@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AsyncLocalStorageModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: "",
      iconMode: 'ios',
      ios: {
        scrollPadding: false,
        scrollAssist: false,
        autoFocusAssist: false,
        inputBlurring: false
      }
    }),
    IonicImageLoader.forRoot(),
    CoreModule.forRoot(),
    SharedModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FCM,
    NativePageTransitions,
		{provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    File,
    Keyboard,
    LocalStorageServiceProvider,
  ]
})
export class AppModule {}
