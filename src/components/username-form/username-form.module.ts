import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from 'ionic-angular';
import { UsernameFormComponent } from '@ashy/components/username-form/username-form';


@NgModule({
  entryComponents: [],
  exports: [UsernameFormComponent],
  declarations: [UsernameFormComponent],
  imports: [
    FormsModule,
    IonicModule
  ],
  providers: []
})

export class UsernameFormModule {}
