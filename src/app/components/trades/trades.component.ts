import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { AddTradeComponent } from './add-trade/add-trade.component';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-trades',
  templateUrl: './trades.component.html',
  styleUrls: ['./trades.component.scss'],
})
export class TradesComponent implements OnInit {
  newDate = new Date();
  trades: any[] = this.dataService.trades

  constructor(
    private dialogService: DialogService,
    private dataService: DataService) {}

  ngOnInit(): void {}

  tradeData(data: any) {
    console.log(data);
    this.trades.push(data);
  }

  openTradeForm(trade?: any) {

    const value = trade ? trade : ''
    console.log(value)
    this.dialogService.open(AddTradeComponent, {
      width: '30vw',
      header: 'Add Trade',
      data: trade
    })
  }
}
