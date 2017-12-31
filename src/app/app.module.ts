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

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';

import { environment } from '../environments/environment'
import { CameraMock } from '../mocks/camera-mock';

import { MyApp } from './app.component';

import { UserServiceProvider } from '../providers/user-service/user-service';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { ModalServiceProvider } from '../providers/modal-service/modal-service';
import { ToastServiceProvider } from '../providers/toast-service/toast-service';
import { LoadingServiceProvider } from '../providers/loading-service/loading-service';
import { AlertServiceProvider } from '../providers/alert-service/alert-service';
import { ErrorDetectionServiceProvider } from '../providers/error-detection-service/error-detection-service';
import { UploadServiceProvider } from '../providers/upload-service/upload-service';
import { UtilityServiceProvider } from '../providers/utility-service/utility-service';
import { EmojiServiceProvider } from '../providers/emoji-service/emoji-service';
import { ChatServiceProvider } from '../providers/chat-service/chat-service';


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
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    UserServiceProvider,
    AuthServiceProvider,
    ModalServiceProvider,
    ToastServiceProvider,
    LoadingServiceProvider,
    AlertServiceProvider,
    ErrorDetectionServiceProvider,
    UploadServiceProvider,
    NativePageTransitions,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    File,
    Keyboard,
    UtilityServiceProvider,
    EmojiServiceProvider,
    ChatServiceProvider
  ]
})
export class AppModule {}
