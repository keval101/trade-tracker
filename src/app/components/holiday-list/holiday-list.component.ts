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
        "tradingDate": "22-Jan-2024",
        "weekDay": "Monday",
        "description": "Special Holiday",
        "Sr_no": 1
      },
      {
        "tradingDate": "26-Jan-2024",
        "weekDay": "Friday",
        "description": "Republic Day",
        "Sr_no": 2
      },
      {
        "tradingDate": "19-Feb-2024",
        "weekDay": "Monday",
        "description": "Chhatrapati Shivaji Maharaj Jayanti",
        "Sr_no": 3
      },
      {
        "tradingDate": "08-Mar-2024",
        "weekDay": "Friday",
        "description": "Mahashivratri",
        "Sr_no": 4
      },
      {
        "tradingDate": "25-Mar-2024",
        "weekDay": "Monday",
        "description": "Holi",
        "Sr_no": 5
      },
      {
        "tradingDate": "29-Mar-2024",
        "weekDay": "Friday",
        "description": "Good Friday",
        "Sr_no": 6
      },
      {
        "tradingDate": "01-Apr-2024",
        "weekDay": "Monday",
        "description": "Annual Bank closing",
        "Sr_no": 7
      },
      {
        "tradingDate": "09-Apr-2024",
        "weekDay": "Tuesday",
        "description": "Gudi Padwa",
        "Sr_no": 8
      },
      {
        "tradingDate": "11-Apr-2024",
        "weekDay": "Thursday",
        "description": "Id-Ul-Fitr (Ramadan Eid)",
        "Sr_no": 9
      },
      {
        "tradingDate": "17-Apr-2024",
        "weekDay": "Wednesday",
        "description": "Ram Navami",
        "Sr_no": 10
      },
      {
        "tradingDate": "01-May-2024",
        "weekDay": "Wednesday",
        "description": "Maharashtra Day",
        "Sr_no": 11
      },
      {
        "tradingDate": "23-May-2024",
        "weekDay": "Thurday",
        "description": "Buddha Pournima",
        "Sr_no": 12
      },
      {
        "tradingDate": "17-Jun-2024",
        "weekDay": "Monday",
        "description": "Bakri Eid",
        "Sr_no": 13
      },
      {
        "tradingDate": "17-Jul-2024",
        "weekDay": "Wednesday",
        "description": "Moharram",
        "Sr_no": 14
      },
      {
        "tradingDate": "15-Aug-2024",
        "weekDay": "Thursday",
        "description": "Independence Day/ Parsi New Year",
        "Sr_no": 15
      },
      {
        "tradingDate": "16-Sep-2024",
        "weekDay": "Monday",
        "description": "Eid-e-Milad",
        "Sr_no": 16
      },
      {
        "tradingDate": "02-Oct-2024",
        "weekDay": "Wednesday",
        "description": "Mahatma Gandhi Jayanti",
        "Sr_no": 17
      },
      {
        "tradingDate": "01-Nov-2024",
        "weekDay": "Friday",
        "description": "Diwali-Laxmi Pujan",
        "Sr_no": 18
      },
      {
        "tradingDate": "15-Nov-2024",
        "weekDay": "Friday",
        "description": "Guru Nanak Jayanti",
        "Sr_no": 19
      },
      {
        "tradingDate": "25-Dec-2024",
        "weekDay": "Wednesday",
        "description": "Christmas",
        "Sr_no": 20
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

      console.log({fday, day, fmonth, month, fyear, year, monthNumber, fMonthNumber})
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
