import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, retry } from 'rxjs';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OverviewComponent implements OnInit, OnDestroy{

  trades$ = new BehaviorSubject([]);
  monthData: any;
  selectedMonthData: any;
  previosMonthData: any;
  selectedTrade: any;
  
  constructor(
    private dataService: DataService,
    private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
      this.getTrades()
  }

  getTrades() {
    this.dataService.getTrades().subscribe(trades => {
      trades.sort((a, b) => {
        const dateA: any = new Date(a.date.split('/').reverse().join('/'));
        const dateB: any = new Date(b.date.split('/').reverse().join('/'));
        return dateA - dateB;
      });
      this.trades$.next(trades);
      this.monthData = this.splitDataByMonth(trades);
    })
  }

  getMonthAnalysisData(data) {
    let object: any = {};
    object[data.key] = data.value;
    const previousDate = this.getPreviousMonth(data.key)
    const previousData: any = {};
    previousData[previousDate] = this.monthData[previousDate]
    console.log(this.getPreviousMonth(data.key), this.monthData, this.monthData[previousDate])
    this.selectedMonthData = this.analyzeSplitData(object)
    this.previosMonthData = this.monthData[previousDate]?.length ? this.analyzeSplitData(previousData) : undefined
    console.log(this.selectedMonthData, this.previosMonthData)
    this.selectedTrade = undefined;
  }

  splitDataByMonth(data) {
    let splitData = {};

    data.forEach(trade => {
        // Extracting month and year from the date
        let [day, month, year] = trade.date.split('/');
        let monthYear = `${month}/${year}`;

        if (!splitData[monthYear]) {
            splitData[monthYear] = [];
        }

        splitData[monthYear].push(trade);
    });

    return splitData;
  }

  findGoodDayOfWeek(splitData) {
    let profitCountByDay = {
        "Sunday": 0,
        "Monday": 0,
        "Tuesday": 0,
        "Wednesday": 0,
        "Thursday": 0,
        "Friday": 0,
        "Saturday": 0
    };

    for (let monthYear in splitData) {
        splitData[monthYear].forEach(trade => {
            let dateParts = trade.date.split('/');
            let date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
            let dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

            if (trade.isProfitable) {
                profitCountByDay[dayOfWeek]++;
            }
        });
    }

    // Find the day with the highest profit count
    let goodDay = Object.keys(profitCountByDay).reduce((a, b) => profitCountByDay[a] > profitCountByDay[b] ? a : b);

    return goodDay;
}

  analyzeSplitData(splitData) {
    let result = {};

    for (let monthYear in splitData) {
        let totalBrokerage = 0;
        let totalDays = 0;
        let totalProfitableDays = 0;
        let maxLoseDay = null;
        let maxLoseAmount = 0;
        let maxProfitDay = null;
        let maxProfitAmount = 0;
        let maxWinStreak = 0;
        let maxLoseStreak = 0;
        let currentWinStreak = 0;
        let currentLoseStreak = 0;
        let totalProfit = 0;
        let totalLose = 0;

        splitData[monthYear].forEach((trade, index) => {
            // Calculate total brokerage
            totalBrokerage += trade.brokerage ? parseInt(trade.brokerage) : 0;
            totalProfit += trade.profit ? parseInt(trade.profit) : 0;
            totalLose += trade.lose ? parseInt(trade.lose) : 0;

            // Count total days and total profitable days
            totalDays++;
            if (trade.isProfitable) {
                totalProfitableDays++;
            }

            // Find maximum lose and profit days
            if (trade.isProfitable) {
                if (trade.profit && parseInt(trade.profit) > maxProfitAmount) {
                    maxProfitAmount = parseInt(trade.profit);
                    maxProfitDay = trade.date;
                }
                currentWinStreak++;
                currentLoseStreak = 0;
            } else {
                if (parseInt(trade.lose) > maxLoseAmount) {
                    maxLoseAmount = parseInt(trade.lose);
                    maxLoseDay = trade.date;
                }
                currentWinStreak = 0;
                currentLoseStreak++;
            }

            // Update max streaks
            if (currentWinStreak > maxWinStreak) {
                maxWinStreak = currentWinStreak;
            }
            if (currentLoseStreak > maxLoseStreak) {
                maxLoseStreak = currentLoseStreak;
            }
        });

        result = {
            totalBrokerage,
            totalDays,
            maxLoseDay,
            maxLoseStreak,
            totalLose,
            maxProfitDay,
            totalProfitableDays,
            maxWinStreak,
            totalProfit,
            maxProfitAmount,
            maxLoseAmount
        };
    }

    return result;
}

getTotalDaysInMonth(month, year) {
  // JavaScript month is 0-indexed, so we need to subtract 1 from the month number
  // to get the correct month index.
  return new Date(year, month, 0).getDate();
}

  getData(data) {
    return data;
  }

  getMonthName(data: any) {
    const [month, year] = data.split('/');
    const monthNumber = parseInt(month, 10);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    if (monthNumber >= 1 && monthNumber <= 12) {
        return months[monthNumber - 1] + ' ' + year;
    } else {
        return 'Invalid month number';
    }
  }

  tradeDetail(trade: any) {
    this.selectedTrade = trade;
    this.selectedMonthData = undefined;
  }

  ngOnDestroy(): void {
    this.trades$.unsubscribe();
  }

  getPreviousMonth(dateString) {
    const [month, year] = dateString.split('/');
    let prevMonth: any = parseInt(month, 10) - 1;
    let prevYear = parseInt(year, 10);

    if (prevMonth === 0) {
        prevMonth = 12; // If the previous month is January, set it to December
        prevYear--;     // Decrement the year
    }

    // Ensure month is formatted with leading zero if necessary
    prevMonth = prevMonth < 10 ? '0' + prevMonth : prevMonth;

    return `${prevMonth}/${prevYear}`;
}

  getMonthStatus() {
    let comparisonText = '';
    if (this.previosMonthData) {
      const difference = this.selectedMonthData.totalProfit - this.previosMonthData.totalProfit;
      if (difference > 0) {
          comparisonText = `<p class="text-xl">You are <span class="text-2xl text-green-600 font-semibold">₹${difference}</span> ahead of last month.</p>`;
      } else if (difference < 0) {
          comparisonText = `<p class="text-xl">You are <span class="text-2xl text-red-600 font-semibold">₹${Math.abs(difference)}</span> behind last month.</p>`;
      } else if( difference == 0){
          comparisonText = `You made the same profit as last month.`;
      } else {
        comparisonText = ''
      }
    }
    return this.sanitizer.bypassSecurityTrustHtml(comparisonText);
  }

}
