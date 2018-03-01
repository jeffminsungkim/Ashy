import { Pipe, PipeTransform } from '@angular/core';

const epochs: any = [
  ['year', 31536000],
  ['month', 2592000],
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
  ['second', 1]
];


@Pipe({
  name: 'simpleRelativeTime',
})
export class SimpleRelativeTimePipe implements PipeTransform {

  getDuration(timeAgoInSeconds: number) {
    for (let [unit, seconds] of epochs) {
      let interval = Math.floor(timeAgoInSeconds / seconds);
      let remains = timeAgoInSeconds - seconds;
      let remainMonth = Math.round(remains / 2592000);
      console.log('remains:', remains);
      console.log('remainMonth:', remainMonth);

      if (interval >= 1) {
        if (remains < 31536000 && unit === 'year' && remainMonth > 0 && remainMonth < 12) {
          return {
            interval: interval,
            epoch: unit,
            extraMonth: remainMonth,
            extraEpoch: 'month'
          };
        } else if (remains > 31536000 && unit === 'year' && remainMonth > 12) {
          let months = remainMonth - (interval - 1) * 12;
          console.log('months:', months);
          if (months === 12) {
            interval += 1;
            months = 0;
          }
          return {
            interval: interval,
            epoch: unit,
            extraMonth:  months <= 0 ? '' : months,
            extraEpoch: 'month'
          };
        } else {
          return {
            interval: interval,
            epoch: unit,
            extraMonth: '',
            extraEpoch: ''
          };
        }
      }
    }

    return {
      interval: 0,
      epoch: 'seconds',
      extraMonth: '',
      extraEpoch: ''
    };
  };
  transform(dateStamp: number): string {
    let timeAgoInSeconds = Math.floor((new Date().getTime() - new Date(dateStamp).getTime()) / 1000);
    let {interval, epoch, extraMonth, extraEpoch} = this.getDuration(timeAgoInSeconds);
    let suffixYear = interval === 1 ? '' : 's';
    let suffixMonth = interval < 2 ? '' : 's';
    let suffixExtraMonth = extraMonth < 2 ? '': 's';

    if (extraMonth === '') return `${interval} ${epoch}${suffixMonth}`;
    else return `${interval} ${epoch}${suffixYear}, ${extraMonth} ${extraEpoch}${suffixExtraMonth}`;
  }
}
