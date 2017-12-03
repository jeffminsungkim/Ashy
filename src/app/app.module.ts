import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { NgProgressModule } from 'ngx-progressbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { environment } from '../environments/environment'

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
    NgProgressModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
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
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
