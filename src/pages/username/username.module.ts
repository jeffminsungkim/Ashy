import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsernamePage } from '@ashy/pages/username/username';
import { ValidationServiceProvider } from '@ashy/services/validation-service/validation-service';


@NgModule({
  declarations: [
    UsernamePage,
  ],
  imports: [
    IonicPageModule.forChild(UsernamePage),
  ],
  providers: [
    ValidationServiceProvider
  ]
})
export class UsernamePageModule {}
