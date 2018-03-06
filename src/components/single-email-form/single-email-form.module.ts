import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from 'ionic-angular';
import { SingleEmailFormComponent } from '@ashy/components/single-email-form/single-email-form';


@NgModule({
  entryComponents: [],
  exports: [SingleEmailFormComponent],
  declarations: [SingleEmailFormComponent],
  imports: [
    FormsModule,
    IonicModule
  ],
  providers: []
})

export class SingleEmailFormModule {}
