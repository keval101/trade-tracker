import { Component } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { AddStockComponent } from './add-stock/add-stock.component';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss']
})
export class StocksComponent {
  public stocks = []

  constructor(
    private dialogService: DialogService,
    private dataService: DataService) {}

  ngOnInit() {
    this.getStocks();
  }

  openStockForm(stock?: any) {
    const dialogRef = this.dialogService.open(AddStockComponent, {
      width: window.innerWidth < 992 ? '80vw' : '40%',
      header: 'Add Stock',
      data: {stock}
    });

    dialogRef.onClose.subscribe(() => {
      this.getStocks();
      dialogRef.destroy();
    });
  }

  getStocks() {
    this.dataService.getStocks().subscribe(stocks => {
      this.stocks = stocks;
    })
  }

}
