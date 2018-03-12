import { Injectable } from '@angular/core';

import { sha256 } from 'js-sha256';
import * as Hashes from 'jshashes';

@Injectable()
export class UtilityServiceProvider {

  constructor() { }

  combineUserIdsToGenerateHashKey(pusherId: string, listenerId: string) {
    const roomId = (pusherId < listenerId ? pusherId + listenerId : listenerId + pusherId);
    console.log(pusherId + ',' + listenerId + '=>', roomId);
    console.log(listenerId + ',' + pusherId + '=>', roomId);
    return sha256(roomId);
  }

  generateRandomString() {
    return Math.random().toString(36).substr(2, 6);
  }

  convertEmailToHash(email: string) {
    const MD5 = new Hashes.MD5;
    return MD5.hex(email);
  }

  // If a string is not found, -1 + 1 = 0 will be falsy, 0.. + 1 = 1.. will be truthy
  isStringStartsWith(str: string, searchStr: string) {
    return (str.lastIndexOf(searchStr, 0) + 1) ? true : false;
  }

}
