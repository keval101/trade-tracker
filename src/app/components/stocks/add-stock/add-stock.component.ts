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
    // name: 'Jio Financial Services',
    // date: '03/09/2024',
    // logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/86/Jio_Financial_Services_Logo.svg/1200px-Jio_Financial_Services_Logo.svg.png',
    // code: 'JIOFIN',
    // link: 'https://www.screener.in/company/JIOFIN/consolidated/#analysis',
    // buyPrice: 345.70,
    // status: 'Hold',
    // sellPrice: 0,
    // totalQuantity: 29,
    // totalAmount: 10025.3,
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
      totalAmount: [0, Validators.required],
    })

    if(this.config.data.stock) {
      let date = this.config.data.stock.date.split('/');
      date = `${date[1]}/${date[0]}/${date[2]}`;
      this.config.data.stock.date = this.datePipe.transform(new Date(date), 'dd/MM/yyyy');
      this.stockForm.patchValue(this.config.data.trade)
    }

  }

  setAmount() {
    const data = this.stockForm.value;
    const amount = data.isSold ? data.sellPrice * data.totalQuantity : data.buyPrice * data.totalQuantity
    this.stockForm.get('totalAmount').setValue(amount)
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
      payload.amount = payload.isSold ? payload.sellPrice * payload.totalQuantity : payload.buyPrice * payload.totalQuantity
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
    if(this.config.data?.trade?.id) {
      id = this.config.data.trade.id
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
