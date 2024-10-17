import { Component } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { AddStockComponent } from './add-stock/add-stock.component';
import { DataService } from 'src/app/service/data.service';
import { DeleteStockComponent } from './delete-stock/delete-stock.component';

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
      this.stocks = this.sortByDate(stocks);
    })
  }

  sortByDate(data) {
    return data.sort((a, b) => {
        const dateA: any = new Date(a.date.split('/').reverse().join('-'));
        const dateB: any = new Date(b.date.split('/').reverse().join('-'));
        return dateB - dateA;
    });
}

  deleteTrade(stock: any) {
    const dialogRef = this.dialogService.open(DeleteStockComponent, {
      width: window.innerWidth < 992 ? '80vw' : '40%',
      header: 'Delete Stock',
      data: stock
    })

    dialogRef.onClose.subscribe(() => {
      this.getStocks();
      dialogRef.destroy();
    })
  }


}
