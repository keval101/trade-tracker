import { Component, OnInit } from '@angular/core';

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

  ngOnInit(): void {
    console.log(this.expectedROI)
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
}
