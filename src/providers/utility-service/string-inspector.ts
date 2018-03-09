import { Injectable } from '@angular/core';


@Injectable()
export class StringInspector {
  constructor() {}

  isStringContainsWhiteSpaceOnly(str: string) : boolean {
    return (!str.trim().length) ? true : false;
  }

  isStringContainsSpecialChar(str: string) : boolean {
    const format = /[ !@#$%^&*()_+\-=\[\]{};':`"\\|,.<>\/?]/;
    return (format.test(str)) ? true : false;
  }

  isStringContainsAlphanumeric(str: string) : boolean {
    const format = /^[a-zA-Z0-9_.-]*$/;
    return (format.test(str)) ? true : false;
  }

  isStringContainsNumberOnly(str: string) : boolean {
    const format = /^[0-9]+$/;
    return (format.test(str)) ? true : false;
  }

  isStringStartsWithLetterWithAlphanumericAtTheEnd(str: string) : boolean {
    const format = /^[a-zA-Z]+[a-zA-Z0-9]*$/;
    return (format.test(str)) ? true : false;
  }
}
