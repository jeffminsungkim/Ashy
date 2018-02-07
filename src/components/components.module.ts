import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { UserStatusComponent } from '@ashy/components/user-status/user-status';


@NgModule({
	declarations: [UserStatusComponent],
	imports: [IonicModule],
	exports: [UserStatusComponent]
})
export class ComponentsModule {}
