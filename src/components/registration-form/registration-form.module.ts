import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { IonicModule } from 'ionic-angular';
import { RegistrationFormComponent } from '@ashy/components/registration-form//registration-form';


@NgModule({
  entryComponents: [],
  exports: [RegistrationFormComponent],
  declarations: [RegistrationFormComponent],
  imports: [
    FormsModule,
    IonicModule
  ],
  providers: []
})

export class RegistrationFormModule {}
