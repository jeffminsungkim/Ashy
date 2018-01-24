import { Injectable } from '@angular/core';

import { sha256 } from 'js-sha256';

@Injectable()
export class UtilityServiceProvider {

  constructor() { }

  combineUserIdsToGenerateHashKey(pusherId: string, listenerId: string) {
    const roomId = (pusherId < listenerId ? pusherId + listenerId : listenerId + pusherId);
    console.log(pusherId + ',' + listenerId + '=>', roomId);
    console.log(listenerId + ',' + pusherId + '=>', roomId);
    return sha256(roomId);
  }

  isStringContainsWhiteSpaceOnly(str: string) : boolean {
    return (!str.trim().length) ? true : false;
  }

  generateRandomString() {
    return Math.random().toString(36).substr(2, 6);
  }

}
