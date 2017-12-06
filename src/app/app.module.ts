import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { NgProgressModule } from 'ngx-progressbar';

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


@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    NgProgressModule
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
    File
  ]
})
export class AppModule {}
