import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
  chartData: any;
  options: any;
  data: any;
  trades: any[] = [];
  trades$ = new BehaviorSubject({})
  sheets: any[] = [];
  barOptions: any;
  barData: any;


  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getTrades();
    this.getSheets();
  }

  setChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
        labels: ['Bank Nifty', 'Nifty', 'Fin Nifty', 'MidCap Nifty'],
        datasets: [
            {
                data: [this.chartData.bank_nifty, this.chartData.nifty, this.chartData.fin_nifty, this.chartData.midcap_nifty] ,
                backgroundColor: [
                  this.setColor(this.chartData.bank_nifty, documentStyle),
                  this.setColor(this.chartData.nifty, documentStyle),
                  this.setColor(this.chartData.fin_nifty, documentStyle),
                  this.setColor(this.chartData.midcap_nifty, documentStyle)],
                hoverBackgroundColor: [
                  this.setColor(this.chartData.bank_nifty, documentStyle),
                  this.setColor(this.chartData.nifty, documentStyle),
                  this.setColor(this.chartData.fin_nifty, documentStyle),
                  this.setColor(this.chartData.midcap_nifty, documentStyle)
                ]
            }
        ]
    };

    this.options = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };
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
    if(data) {
      const percentage = ((data.currentWeekCapital - data.currentWeekExpectedResult) * 100) / data.currentWeekExpectedResult;
      return percentage;
    } else {
      return 0;
    }
  }

  getTrades() {
    this.dataService.getTrades().subscribe(trades => {
      trades.sort((a, b) => {
        const dateA: any = new Date(a.date.split('/').reverse().join('/'));
        const dateB: any = new Date(b.date.split('/').reverse().join('/'));
        return dateA - dateB;
      });
      this.chartData = this.calculateMarketProfits(trades)
      this.setChart();
      this.trades$.next(trades);
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

  calculateMarketProfits(trades) {
    let marketProfits = {};

    trades.forEach(trade => {
        const { profit, lose, market, isProfitable } = trade;
        let profitValue = parseFloat(profit);
        let loseValue = parseFloat(lose);

        if (isNaN(profitValue)) profitValue = 0;
        if (isNaN(loseValue)) loseValue = 0;

        const formattedMarket = market.toLowerCase().replace(/\s+/g, '_');
        const tradeProfitLoss = isProfitable ? profitValue : -loseValue;

        if (!marketProfits[formattedMarket]) {
            marketProfits[formattedMarket] = tradeProfitLoss;
        } else {
            marketProfits[formattedMarket] += tradeProfitLoss;
        }
    });

    return marketProfits;
  }

  setColor(marketValue: any, documentStyle:any) {
    if(marketValue < 0 && marketValue < -500) {
      return documentStyle.getPropertyValue('--red-500');
    } else if (marketValue < 0 && marketValue < -1000) {
      return documentStyle.getPropertyValue('--red-300');
    } else if(marketValue > 0 && marketValue > 3000) {
      return documentStyle.getPropertyValue('--green-600');
    } else if(marketValue > 0 && marketValue > 2000) {
      return documentStyle.getPropertyValue('--green-500');
    } else if(marketValue > 0 && marketValue > 1000) {
      return documentStyle.getPropertyValue('--green-300');
    }
  }

  getSheets() {
    this.dataService.getSheet().subscribe(sheets => {
      sheets.sort((a, b) => {
        const dateA: any = new Date(a.date.split('/').reverse().join('/'));
        const dateB: any = new Date(b.date.split('/').reverse().join('/'));
        return dateA - dateB;
      });
      this.sheets = sheets;

      const data: any = [];
      this.sheets.map(sheet => {
      this.trades$.subscribe((trades: any) => {
        const index = trades.findIndex(x => x.date == sheet.date)
        const tradeData = trades.slice(index, index + sheet.data.length)
        this.groupedData.push(tradeData)
      })
      })
      this.setWeeklyData();
    })
  }

  setWeeklyData() {
    this.groupedData.map((x: any, index: number) => {
      const finalCapital = x[x.length - 1]?.isProfitable == true ? +x[x.length - 1].investment + +x[x.length - 1].profit - +x[x.length - 1].brokerage : +x[x.length - 1].investment - +x[x.length - 1].lose - +x[x.length - 1].brokerage;
      const object = {
        currentWeekInvestment: x[0].investment,
        currentWeekExpectedROI: this.roi,
        currentWeekExpectedResult: this.calculateCapital(+x[0].investment, this.roi, x.length),
        currentWeekCapital: finalCapital,
        week: index + 1
      }
      this.weeklyROIData.push(object)
    })
    this.selectedWeek = this.weeklyROIData.length;
    this.selectedWeekData = this.weeklyROIData[this.selectedWeek - 1];
    this.setBarCharts();
  }

  setBarCharts() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const labels = this.weeklyROIData.map(x => `Week ${x.week}`);
    const weekInvestment = this.weeklyROIData.map(x => +x.currentWeekInvestment);
    const weekEndResult = this.weeklyROIData.map(x => +x.currentWeekCapital);
    const weekEndResultBarColors = this.weeklyROIData.map(x => +x.currentWeekCapital > +x.currentWeekInvestment ? documentStyle.getPropertyValue('--green-500') : documentStyle.getPropertyValue('--red-500'))
    this.barData = {
        labels: labels,
        datasets: [
            {
                // barThickness: 50,
                label: 'Week Investment',
                backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                borderColor: documentStyle.getPropertyValue('--blue-500'),
                data: weekInvestment
            },
            {
                // barThickness: 50,
                label: 'Week End Result',
                backgroundColor: weekEndResultBarColors,
                borderColor: weekEndResultBarColors,
                data: weekEndResult
            }
        ]
    };

    this.barOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }

        }
    };
  }
}
