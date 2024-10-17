import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-add-stock',
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddStockComponent {

  stockForm: FormGroup;
  isEdit = false;

  @Output() emitModalClose = new EventEmitter()

  constructor(
    private fb: FormBuilder,
    public config: DynamicDialogConfig,
    public dataService: DataService,
    public ref: DynamicDialogRef,
    private messageService: MessageService,
    private datePipe: DatePipe) {}

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
      totalBuyAmount: [{value: 0,disabled: true}, Validators.required],
      totalSellAmount: [{value: 0, disabled: true}],
    })

    if(this.config.data.stock) {
      let date = this.config.data.stock.date.split('/');
      date = `${date[1]}/${date[0]}/${date[2]}`;
      this.config.data.stock.date = this.datePipe.transform(new Date(date), 'dd/MM/yyyy');
      this.stockForm.patchValue(this.config.data.stock)
    }

  }

  setAmount() {
    const data = this.stockForm.value;
    if(data.isSold) {
      const amount = data.sellPrice * data.totalQuantity;
      this.stockForm.get('totalSellAmount').setValue(amount)
    } else {
      const amount = data.buyPrice * data.totalQuantity;
      this.stockForm.get('totalBuyAmount').setValue(amount)
    }
  }

  addTrade() {
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
      // if(!this.config.data.stock && !this.config.data.selectedRow) {
      //   this.addNewTrade(payload);
      // } else {
      //   this.updateTrade(payload)
      // }
      
      // this.ref.close()
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
}
