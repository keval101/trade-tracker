import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { AddTradeComponent } from './add-trade/add-trade.component';
import { DataService } from 'src/app/service/data.service';
import { DeleteTradeComponent } from './delete-trade/delete-trade.component';

@Component({
  selector: 'app-trades',
  templateUrl: './trades.component.html',
  styleUrls: ['./trades.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TradesComponent implements OnInit {
  newDate = new Date();
  trades: any[] = [];
  isLoading = true;
  tradeOverview: any;
  tradingAccuracy: any;

  constructor(
    private dialogService: DialogService,
    private dataService: DataService) {}

  ngOnInit(): void {
    this.getTrades();
  }

  openTradeForm(trade?: any) {
    const dialogRef = this.dialogService.open(AddTradeComponent, {
      width: '30vw',
      header: 'Add Trade',
      data: trade
    });

    dialogRef.onClose.subscribe(() => {
      this.getTrades();
      dialogRef.destroy();
    });
  }

  getTrades() {
    this.trades = [];
    this.isLoading = true;
    this.dataService.getTrades().subscribe(trades => {
      trades.sort((a, b) => {
        const dateA: any = new Date(a.date.split('/').reverse().join('/'));
        const dateB: any = new Date(b.date.split('/').reverse().join('/'));
        return dateB - dateA;
      });
      this.trades = trades;
      this.tradingAccuracy = this.calculateTotalDaysAndProfitableDays(this.trades)
      this.isLoading = false;

      const totalProfit = this.trades.reduce((total, current) => total + +current.profit, 0)
      const totalLose = this.trades.reduce((total, current) => total + +current.lose, 0)
      this.tradeOverview = {
        totalTrades: this.trades.reduce((total, current) => total + current.totalTrades, 0),
        brokerage: this.trades.reduce((total, current) => total + +current.brokerage, 0),
        profitLose: totalProfit - totalLose,
      }

    },
    (error) => this.isLoading = false)
  }

  deleteTrade(trade: any) {
    const dialogRef = this.dialogService.open(DeleteTradeComponent, {
      width: '30vw',
      header: 'Delete Trade',
      data: trade
    })

    dialogRef.onClose.subscribe(() => {
      this.getTrades();
      dialogRef.destroy();
    })
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
  calculateTotalDaysAndProfitableDays(trades) {
    let totalDays = 0;
    let totalProfitableDays = 0;

    trades.forEach(trade => {
        const { isProfitable } = trade;

        // Increment total days count for each trade
        totalDays++;

        // Increment profitable days count if the trade is profitable
        if (isProfitable) {
            totalProfitableDays++;
        }
    });

    return {
        totalDays,
        totalProfitableDays
    };
}
}
