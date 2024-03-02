import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { AddTradeComponent } from './add-trade/add-trade.component';
import { DataService } from 'src/app/service/data.service';
import { DeleteTradeComponent } from './delete-trade/delete-trade.component';

@Component({
  selector: 'app-trades',
  templateUrl: './trades.component.html',
  styleUrls: ['./trades.component.scss'],
})
export class TradesComponent implements OnInit {
  newDate = new Date();
  trades: any[] = [];
  isLoading = true;
  tradeOverview: any;

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
        return dateA - dateB;
      });
      this.trades = trades;
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
}
