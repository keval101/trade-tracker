import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  expectedROI = {
    currentWeekInvestment: 2000,
    currentWeekExpectedROI: 10,
    currentWeekExpectedResult: this.calculateCapital(2000, 10, 5),
    currentWeekCapital: 4500
  };

  roi = 10;
  groupedData: any[][] = [];
  weeklyROIData: any[] = [];
  selectedWeek: number;
  selectedWeekData: any;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getTrades();
  }

  calculateCapital(initialCapital, roi, days) {
    let capital = initialCapital;
    for (let i = 1; i <= days; i++) {
        const profit = (capital * roi) / 100;
        capital += profit;
    }
    return capital.toFixed(2);
  }

  calculatePercentage(data)  {
    const percentage = (data.currentWeekCapital * 100) / data.currentWeekExpectedResult
    return percentage > 0 ? (((data.currentWeekCapital * 100) / data.currentWeekExpectedResult) - 100) : (100 - ((data.currentWeekCapital * 100) / data.currentWeekExpectedResult));
  }

  getTrades() {
    this.dataService.getTrades().subscribe(trades => {
      trades.sort((a, b) => {
        const dateA: any = new Date(a.date.split('/').reverse().join('/'));
        const dateB: any = new Date(b.date.split('/').reverse().join('/'));
        return dateA - dateB;
      });
      const tradesData = trades;

      // Group the data by week
      this.groupedData = tradesData.reduce((acc, obj) => {
        const weekNumber = this.getWeekNumber(new Date(obj.date.split('/').reverse().join('/')));
        if (!acc[weekNumber]) {
          acc[weekNumber] = [];
        }
        acc[weekNumber].push(obj);
        return acc;
      }, []);

      this.groupedData = this.groupedData.filter(week => week.length > 0)

      this.groupedData.map(x => {
        const finalCapital = x[x.length - 1].isProfitable == true ? +x[x.length - 1].investment + +x[x.length - 1].profit - +x[x.length - 1].brokerage : +x[x.length - 1].investment - +x[x.length - 1].lose - +x[x.length - 1].brokerage;
        const object = {
          currentWeekInvestment: x[0].investment,
          currentWeekExpectedROI: this.roi,
          currentWeekExpectedResult: this.calculateCapital(+x[0].investment, this.roi, x.length),
          currentWeekCapital: finalCapital
        }
        this.weeklyROIData.push(object)
      })
      this.selectedWeek = this.weeklyROIData.length;
      this.selectedWeekData = this.weeklyROIData[this.selectedWeek - 1];
    })
  }

  getWeekNumber(date) {
    const d: any = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart: any = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  }

  prevWeek() {
    this.selectedWeek = this.selectedWeek != 1 ? this.selectedWeek - 1 : 1;
    this.selectedWeekData = this.selectedWeek != 1 ? this.weeklyROIData[this.selectedWeek - 1] : this.weeklyROIData[0];
  }

  nextWeek() {
    this.selectedWeek = this.selectedWeek != this.weeklyROIData.length ? this.selectedWeek + 1 : this.weeklyROIData.length;
    this.selectedWeekData = this.selectedWeek != this.weeklyROIData.length ? this.weeklyROIData[this.selectedWeek - 1] : this.weeklyROIData[this.weeklyROIData.length - 1];
  }
}
