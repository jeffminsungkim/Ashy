import { Component, Input } from '@angular/core';


@Component({
  selector: 'user-status',
  templateUrl: 'user-status.html'
})
export class UserStatusComponent {

  @Input() status: string;

  constructor() { }

}
