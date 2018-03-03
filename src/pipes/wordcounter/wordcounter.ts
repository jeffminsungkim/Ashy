import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'wordcounter',
  pure: true
})
export class WordcounterPipe implements PipeTransform {
  transform(text: string, args: number) {
    let maxLength = args || 20;
    let textLength = text.length;
    return `${textLength}/${maxLength}`;
  }
}
