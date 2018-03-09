import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { take, map, filter } from 'rxjs/operators';


@Injectable()
export class ValidationServiceProvider {

  constructor(private afs: AngularFirestore) {}

  isUsernameAvailableOrNot(username: string) {
    return this.afs.collection('usernames', ref => ref.where('username', '==', username))
    .valueChanges().pipe(
      debounceTime(500),
      take(1),
      map(arr => arr.length ? { usernameAvailable: false } : null),
    )
  }

}
