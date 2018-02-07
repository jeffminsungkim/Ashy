import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WelcomePage } from '@ashy/pages/welcome/welcome';
import { TwitterConnect } from '@ionic-native/twitter-connect';

@NgModule({
  declarations: [
    WelcomePage,
  ],
  imports: [
    IonicPageModule.forChild(WelcomePage),
  ],
  providers: [TwitterConnect]
})
export class WelcomePageModule {}
