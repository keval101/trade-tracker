import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DataService } from 'src/app/service/data.service';
import { NseDataService } from 'src/app/service/nse-data.service';
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap, catchError, of } from 'rxjs';

@Component({
  selector: 'app-add-stock',
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddStockComponent implements OnInit, OnDestroy {

  stockForm: FormGroup;
  isEdit = false;

  @Output() emitModalClose = new EventEmitter();

  searchQuery: string = '';
  searchResults: any[] = [];
  showSearchResults: boolean = false;
  isSearching: boolean = false;
  private searchSubject = new Subject<string>();
  private searchSubscription: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    public config: DynamicDialogConfig,
    public dataService: DataService,
    public ref: DynamicDialogRef,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private nseDataService: NseDataService) {}

  ngOnInit(): void {
    this.stockForm = this.fb.group({
      name: [null, Validators.required],
      date: [null, Validators.required],
      logo: [null, Validators.required],
      code: [null, Validators.required],
      buyPrice: [0, Validators.required],
      status: [null],
      isSold: [false],
      sellPrice: [0, Validators.required],
      totalQuantity: [0, Validators.required],
      totalBuyAmount: [0],
      totalSellAmount: [0],
    })

    if(this.config.data.stock) {
      let date = this.config.data.stock.date.split('/');
      date = `${date[1]}/${date[0]}/${date[2]}`;
      this.config.data.stock.date = this.datePipe.transform(new Date(date), 'dd/MM/yyyy');
      this.stockForm.patchValue(this.config.data.stock)
      this.searchQuery = this.config.data.stock.name || '';
    }

    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (query && query.length >= 2) {
          this.isSearching = true;
          return this.nseDataService.searchCompany(query).pipe(
            catchError(() => {
              this.messageService.add({ severity: 'warn', summary: 'Search Failed', detail: 'Unable to search companies. Please enter details manually.' });
              return of([]);
            })
          );
        } else {
          this.searchResults = [];
          this.showSearchResults = false;
          return of([]);
        }
      })
    ).subscribe((results: any) => {
      this.isSearching = false;
      if (results?.symbols && Array.isArray(results.symbols)) {
        const equityStocks = results.symbols.filter((item: any) =>
          item.result_sub_type === 'equity' && item.activeSeries?.length > 0
        );
        this.searchResults = equityStocks;
        this.showSearchResults = equityStocks.length > 0;
      } else if (Array.isArray(results)) {
        this.searchResults = results;
        this.showSearchResults = results.length > 0;
      } else {
        this.searchResults = [];
        this.showSearchResults = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) { this.searchSubscription.unsubscribe(); this.searchSubscription = null; }
    this.searchSubject.complete();
  }

  setAmount() {
    const data = this.stockForm.value;
    if(data.sellPrice) {
      const amount = data.sellPrice * data.totalQuantity;
      this.stockForm.get('totalSellAmount').setValue(amount)
    }
    if(data.buyPrice) {
      const amount = data.buyPrice * data.totalQuantity;
      this.stockForm.get('totalBuyAmount').setValue(amount)
    }
  }

  addTrade() {
    this.setAmount();
    if(this.stockForm.valid) {
      const payload = this.stockForm.value;
      if(!this.config.data.stock) {
        const formatedDate = typeof(this.stockForm.value.date) != 'string' ? this.datePipe.transform(this.stockForm.value.date, 'dd/MM/yyyy') : this.stockForm.value.date
        payload.date = formatedDate;
      } else {
        const formatedDate = typeof(this.stockForm.value.date) != 'string' ? this.datePipe.transform(this.stockForm.value.date, 'dd/MM/yyyy') : this.stockForm.value.date
        payload.date = formatedDate;
      }
      payload.status = payload.isSold ? 'Sell' : 'Hold'
      payload.amount = payload.isSold ? payload.sellPrice * payload.totalQuantity : payload.buyPrice * payload.totalQuantity;
      if(payload.isSold) {
        const sellDate = new Date()
        payload['sellOn'] = this.datePipe.transform(sellDate, 'dd/MM/yyyy')
      }

      console.log('payload', payload)
      if(!this.config.data.stock && !this.config.data.selectedRow) {
        this.addNewTrade(payload);
      } else {
        this.updateTrade(payload)
      }
      
      this.ref.close()
    }
  }

  addNewTrade(payload) {
    this.dataService.addStock(payload).then(() => {
      this.messageService.add({ severity: 'success', summary: 'Stock', detail: 'Stock Added Successfully!' });
    })
    .catch((error) => {
      console.error('Error adding document: ', error);
    });
  }

  updateTrade(payload) {
    let id;
    if(this.config.data?.stock?.id) {
      id = this.config.data.stock.id
    } else if(this.config.data?.selectedRow?.tradeId) {
      id = this.config.data.selectedRow.tradeId
    }
    this.dataService.updateStock(id, payload).then(() => {
      this.messageService.add({ severity: 'success', summary: 'Stock', detail: 'Stock Updated Successfully!' });
    })
    .catch((error) => {
      console.error('Error adding document: ', error);
    });
  }

  trackBySearchResult(_index: number, company: any): string { return company?.symbol ?? String(_index); }

  onSearchChange(query: string) {
    this.searchQuery = query;
    this.searchSubject.next(query);
  }

  selectCompany(company: any) {
    // NSE API structure: { symbol, symbol_info, result_sub_type, activeSeries, ... }
    const symbol = company.symbol || '';
    const companyName = company.symbol_info || company.name || company.companyName || symbol;
    
    // Generate logo URL - use common patterns
    const logoUrl = `https://assets-netstorage.groww.in/stock-assets/logos2/${symbol.toUpperCase()}.webp`;
    
    // Auto-fill form fields
    this.stockForm.patchValue({
      name: companyName,
      code: symbol.toUpperCase(),
      logo: logoUrl
    });

    this.searchQuery = companyName;
    this.showSearchResults = false;
    this.searchResults = [];
    
    this.messageService.add({ 
      severity: 'success', 
      summary: 'Company Selected', 
      detail: `${companyName} (${symbol.toUpperCase()}) details filled automatically.` 
    });
  }

  closeSearchResults() {
    // Close search results when clicking outside
    setTimeout(() => {
      this.showSearchResults = false;
    }, 200);
  }
}
