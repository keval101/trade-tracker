import { Component, OnInit, OnDestroy } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { AddStockComponent } from './add-stock/add-stock.component';
import { DataService } from 'src/app/service/data.service';
import { DeleteStockComponent } from './delete-stock/delete-stock.component';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss']
})
export class StocksComponent implements OnInit, OnDestroy {
  stocks: any[] = [];
  private stocksSubscription: Subscription | null = null;

  constructor(
    private dialogService: DialogService,
    private dataService: DataService) {}

  ngOnInit(): void {
    this.subscribeToStocks();
  }

  ngOnDestroy(): void {
    if (this.stocksSubscription) {
      this.stocksSubscription.unsubscribe();
      this.stocksSubscription = null;
    }
  }

  private subscribeToStocks(): void {
    if (this.stocksSubscription) this.stocksSubscription.unsubscribe();
    this.stocksSubscription = this.dataService.getStocks().subscribe(stocks => {
      this.stocks = this.sortByDate(stocks);
    });
  }

  sortByDate(data: any[]): any[] {
    return data.slice().sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateB.getTime() - dateA.getTime();
    });
  }

  openStockForm(stock?: any): void {
    const dialogRef = this.dialogService.open(AddStockComponent, {
      width: window.innerWidth < 600 ? '90%' : '500px',
      header: 'Add Stock',
      data: { stock }
    });
    dialogRef.onClose.pipe(take(1)).subscribe(() => dialogRef.destroy());
  }

  trackByStockId(_index: number, stock: any): string { return stock?.id ?? String(_index); }

  deleteTrade(stock: any): void {
    const dialogRef = this.dialogService.open(DeleteStockComponent, {
      width: window.innerWidth < 600 ? '90%' : '500px',
      header: 'Delete Stock',
      data: stock
    });
    dialogRef.onClose.pipe(take(1)).subscribe(() => dialogRef.destroy());
  }
}
