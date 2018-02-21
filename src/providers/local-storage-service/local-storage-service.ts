import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AsyncLocalStorage } from 'angular-async-local-storage';

export interface Token {
  accessToken: string;
}

@Injectable()
export class LocalStorageServiceProvider {

  constructor(private afAuth: AngularFireAuth, private localStorage: AsyncLocalStorage) {

  }

  getIdenticonHash() {
    return this.localStorage.getItem('identicon_hash');
  }

  getToken(key: string) {
    return this.localStorage.getItem<Token>(key);
  }

  storeIdenticonHash(hash: string) {
    console.log('store identicon hash:', hash);
    this.localStorage.setItem('identicon_hash', hash).subscribe(() => {});
  }

  storeToken(key: string, token: Token) {
    this.localStorage.setItem(key, token).subscribe(() => {});
  }

  storeNewToken(key: string) {
    this.afAuth.auth.currentUser.getIdToken(true).then((token) => {
      this.localStorage.setItem(key, { 'accessToken': token }).subscribe(() => {});
    });
  }

  reStoreAccessToken(key: string) {
    this.afAuth.auth.currentUser.getIdToken().then((token) => {
      this.localStorage.setItem(key, { 'accessToken': token }).subscribe(() => {});
    });
  }

  removeStorageItem(key: string) {
    this.localStorage.removeItem(key).subscribe(() => {});
  }

  clearStorage() {
    this.localStorage.clear().subscribe(() => {});
  }
}
