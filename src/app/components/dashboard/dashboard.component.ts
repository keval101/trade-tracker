import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy{
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
  trades$ = new BehaviorSubject([])
  sheets: any[] = [];
  barOptions: any;
  barData: any;


  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getTrades();
    this.getSheets();
  }

  setChart() {
    const textColor = '#e5e7eb'; // gray-200 for dark theme
    
    // Distinct vibrant colors for each market
    const chartColors = [
      '#3b82f6', // blue-500 - Bank Nifty
      '#10b981', // emerald-500 - Nifty  
      '#f59e0b', // amber-500 - Fin Nifty
      '#8b5cf6', // violet-500 - MidCap Nifty
      '#ec4899', // pink-500 - Sensex
    ];

    this.data = {
        labels: ['Bank Nifty', 'Nifty', 'Fin Nifty', 'MidCap Nifty', 'Sensex'],
        datasets: [
            {
                data: [this.chartData.bank_nifty, this.chartData.nifty, this.chartData.fin_nifty, this.chartData.midcap_nifty, this.chartData.sensex],
                backgroundColor: chartColors,
                hoverBackgroundColor: chartColors,
                borderColor: '#1e293b', // slate-800
                borderWidth: 2
            }
        ]
    };

    this.options = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor,
                    padding: 16,
                    font: {
                        size: 12
                    }
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
      const percentage = ((data.currentWeekOverallResult - data.currentWeekInvestment) * 100) / data.currentWeekInvestment;
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
      console.log('chartData', this.chartData);
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

  setColor(marketValue: any, documentStyle:any): string {
    // Dark theme colors - more vibrant for better visibility
    if(marketValue < 0 && marketValue < -1000) {
      return '#dc2626'; // red-600
    } else if(marketValue < 0 && marketValue < -500) {
      return '#ef4444'; // red-500
    } else if (marketValue < 0 && marketValue < -1) {
      return '#f87171'; // red-400
    } else if(marketValue > 0 && marketValue > 3000) {
      return '#059669'; // emerald-600
    } else if(marketValue > 0 && marketValue > 2000) {
      return '#10b981'; // emerald-500
    } else if(marketValue > 0 && marketValue > 1000) {
      return '#34d399'; // emerald-400
    } else if(marketValue > 0) {
      return '#6ee7b7'; // emerald-300
    } else {
      return '#64748b'; // slate-500 (for zero or undefined)
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
        if(index >= 0) {
          const tradeData = trades.slice(index, index + sheet.data.length);
          tradeData['totalProfit'] = sheet.data.reduce((total, trade) => {
            const profit = Number(trade?.profit) || 0;
            const lose = Number(trade?.lose) || 0;
            return total + profit - lose;
          }, 0);
          tradeData['totalDays'] = sheet.days;
          tradeData['roi'] = sheet.roi;
          tradeData['startingWeekCapital'] = sheet.capital;
          this.groupedData.push(tradeData);
        }
      })
    })
      this.trades$.unsubscribe();
      this.setWeeklyData();
    })
  }

  setWeeklyData() {
    this.groupedData.map((x: any, index: number) => {
      if(x.length) {
        const lastTrade = x[x.length - 1];
        const finalCapital = lastTrade?.isProfitable === true
          ? +lastTrade.investment + +lastTrade.profit - +lastTrade.brokerage
          : +lastTrade.investment - +lastTrade.lose - +lastTrade.brokerage;
        const totalBrokerage = x.reduce((total, trade) => total + (+trade.brokerage || 0), 0);
        const object = {
          currentWeekInvestment: x.startingWeekCapital,
          currentWeekExpectedROI: x.roi,
          currentWeekExpectedResult: this.calculateCapital(+x.startingWeekCapital, x.roi, x.totalDays),
          currentWeekCapital: finalCapital,
          currentWeekOverallResult: +x.startingWeekCapital + x.totalProfit - totalBrokerage,
          week: index + 1
        }
        this.weeklyROIData.push(object)
      }
    })
    this.selectedWeek = this.weeklyROIData.length;
    this.selectedWeekData = this.weeklyROIData[this.selectedWeek - 1];
    this.setBarCharts();
  }

  setBarCharts() {
    const documentStyle = getComputedStyle(document.documentElement);
    // Dark theme colors
    const textColor = '#e5e7eb'; // gray-200
    const textColorSecondary = '#9ca3af'; // gray-400
    const gridColor = 'rgba(71, 85, 105, 0.5)'; // slate-600 with opacity
    
    const labels = this.weeklyROIData.map(x => `Week ${x.week}`);
    const weekInvestment = this.weeklyROIData.map(x => +x.currentWeekInvestment);
    const weekEndResult = this.weeklyROIData.map(x => +x.currentWeekOverallResult);
    const weekEndResultBarColors = this.weeklyROIData.map(x => +x.currentWeekOverallResult > +x.currentWeekInvestment ? '#10b981' : '#ef4444'); // emerald-500 / red-500
    
    this.barData = {
        labels: labels,
        datasets: [
            {
                label: 'Week Investment',
                backgroundColor: '#3b82f6', // blue-500
                borderColor: '#3b82f6',
                data: weekInvestment
            },
            {
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
                    color: gridColor,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: gridColor,
                    drawBorder: false
                }
            }
        }
    };
  }

  ngOnDestroy(): void {
      this.trades$.unsubscribe();
  }
}
