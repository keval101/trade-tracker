import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-holiday-list',
  templateUrl: './holiday-list.component.html',
  styleUrls: ['./holiday-list.component.scss']
})
export class HolidayListComponent {

  holidays = [
    {
      tradingDate: '15-Jan-2026',
      weekDay: 'Thursday',
      description: 'Municipal Corporation Election - Maharashtra'
    },
    {
      tradingDate: '26-Jan-2026',
      weekDay: 'Monday',
      description: 'Republic Day'
    },
    {
      tradingDate: '03-Mar-2026',
      weekDay: 'Tuesday',
      description: 'Holi'
    },
    {
      tradingDate: '26-Mar-2026',
      weekDay: 'Thursday',
      description: 'Shri Ram Navami'
    },
    {
      tradingDate: '31-Mar-2026',
      weekDay: 'Tuesday',
      description: 'Shri Mahavir Jayanti'
    },
    {
      tradingDate: '03-Apr-2026',
      weekDay: 'Friday',
      description: 'Good Friday'
    },
    {
      tradingDate: '14-Apr-2026',
      weekDay: 'Tuesday',
      description: 'Dr. Baba Saheb Ambedkar Jayanti'
    },
    {
      tradingDate: '01-May-2026',
      weekDay: 'Friday',
      description: 'Maharashtra Day'
    },
    {
      tradingDate: '28-May-2026',
      weekDay: 'Thursday',
      description: 'Bakri Id'
    },
    {
      tradingDate: '26-Jun-2026',
      weekDay: 'Friday',
      description: 'Muharram'
    },
    {
      tradingDate: '14-Sep-2026',
      weekDay: 'Monday',
      description: 'Ganesh Chaturthi'
    },
    {
      tradingDate: '02-Oct-2026',
      weekDay: 'Friday',
      description: 'Mahatma Gandhi Jayanti'
    },
    {
      tradingDate: '20-Oct-2026',
      weekDay: 'Tuesday',
      description: 'Dussehra'
    },
    {
      tradingDate: '10-Nov-2026',
      weekDay: 'Tuesday',
      description: 'Diwali-Balipratipada'
    },
    {
      tradingDate: '24-Nov-2026',
      weekDay: 'Tuesday',
      description: 'Prakash Gurpurb Sri Guru Nanak Dev'
    },
    {
      tradingDate: '25-Dec-2026',
      weekDay: 'Friday',
      description: 'Christmas'
    }
  ]

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
