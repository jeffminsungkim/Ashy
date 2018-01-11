import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { Keyboard } from '@ionic-native/keyboard';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { IonicImageLoader } from 'ionic-image-loader';

import { MyApp } from './app.component';
import { CoreModule } from '@ashy-core/core.module';
import { SharedModule } from '@ashy-shared/shared.module';

import { ErrorDetectionServiceProvider } from '@ashy-services/error-detection-service/error-detection-service';


@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      ios: {
        scrollPadding: false,
        scrollAssist: true,
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
    ErrorDetectionServiceProvider,
    NativePageTransitions,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    File,
    Keyboard
  ]
})
export class AppModule {}
