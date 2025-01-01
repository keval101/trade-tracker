import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-holiday-list',
  templateUrl: './holiday-list.component.html',
  styleUrls: ['./holiday-list.component.scss']
})
export class HolidayListComponent {

  holidays = []

    constructor(private datepipe: DatePipe) {}

    checkDateIsOutDated(date: string) {
      let isOutDate;
      let [day, month, year] = date.split('-');
      const today = new Date();
      const formateDate = this.datepipe.transform(today, 'dd-MMM-yyyy')
      const [fday, fmonth, fyear] = formateDate.split('-');
      const months: any = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const monthNumber = months.findIndex( m => m == month);
      const fMonthNumber = months.findIndex(m => m == fmonth);

      if((+fday >= +day && +fMonthNumber >= +monthNumber && +fyear >= +year)) {
        isOutDate = true
      } else if(+fday <= +day && +fMonthNumber > +monthNumber && +fyear >= +year){
        isOutDate = true
      } else {
        isOutDate = false
      }

      return isOutDate

    }
}
