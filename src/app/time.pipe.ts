import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
  name: 'secondsToTime'
})
export class secondsToTimePipe {

  transform(seconds: number) {
    var sec_num = seconds; // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    var h, m, s;
    h = hours.toString();
    m = minutes.toString();
    s = seconds.toString();
    if (hours < 10) { h = "0" + hours; }

    if (minutes < 10) { m = "0" + minutes; }
    if (seconds < 10) { s = "0" + seconds; }


    return h + ':' + m + ':' + s;
  }
}
@Pipe({
  name: 'dateToTime'
})
export class dateToTimePipe {
  transform(str: string) {
    var date = new Date(Date.parse(str));
    var minutes = date.getMinutes();
    let minuteStr = '';
    if (minutes > 0) minuteStr = String(minutes) +' phút ';
    var hours = String(date.getHours());
  
    let month = String(date.getMonth()+1);
    let day = String(date.getUTCDate());
    const year = String(date.getFullYear());
    let dayofweek = date.getDay();
    if (dayofweek == 0) dayofweek = 7;
    else dayofweek += 1;
    return `${hours} giờ ${minuteStr}- thứ ${dayofweek} ngày ${day}/${month}/${year}`;
  }
}
@Pipe({ name: 'groupBy' })
export class GroupByPipe implements PipeTransform {
  transform(collection: Array<any>, property: string): Array<any> {
    // prevents the application from breaking if the array of objects doesn't exist yet
    if (!collection) {
      return null;
    }

    const groupedCollection = collection.reduce((previous, current) => {
      if (!previous[current[property]]) {
        previous[current[property]] = [current];
      } else {
        previous[current[property]].push(current);
      }

      return previous;
    }, {});

    // this will return an array of objects, each object containing a group of objects
    return Object.keys(groupedCollection).map(key => ({ key, value: groupedCollection[key] }));
  }
}
