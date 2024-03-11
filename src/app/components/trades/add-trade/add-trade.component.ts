import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DataService } from 'src/app/service/data.service';
@Component({
  selector: 'app-add-trade',
  templateUrl: './add-trade.component.html',
  styleUrls: ['./add-trade.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddTradeComponent implements OnInit{

  tradeForm: FormGroup;
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
    this.tradeForm = this.fb.group({
      date: [null, Validators.required],
      totalTrades: [null, Validators.required],
      market: [null, Validators.required],
      investment: [null, Validators.required],
      isProfitable: [false, Validators.required],
      profit: [0],
      lose: [0],
      brokerage: [0, Validators.required]
    })

    const preferredMarket = localStorage.getItem('preferredMarket');
    if(preferredMarket) {
      this.tradeForm.get('market').setValue(preferredMarket);
    }
    if(this.config.data) {
      let date = this.config.data.date.split('/');
      date = `${date[1]}/${date[0]}/${date[2]}`;
      this.config.data.date = this.datePipe.transform(new Date(date), 'dd/MM/yyyy');
      this.tradeForm.patchValue(this.config.data)
      this.tradeForm.get('isProfitable').setValue(this.config.data.isProfitable ? true : false)
    }
  }

  addTrade() {
    if(this.tradeForm.valid) {
      const payload = this.tradeForm.value;
      if(!this.config.data) {
        const formatedDate = this.datePipe.transform(this.tradeForm.value.date, 'dd/MM/yyyy')
        payload.date = formatedDate;
      } else {
        const formatedDate = typeof(this.tradeForm.value.date) != 'string' ? this.datePipe.transform(this.tradeForm.value.date, 'dd/MM/yyyy') : this.tradeForm.value.date
        payload.date = formatedDate;
      }
      if(payload.isProfitable) {
        payload.lose = 0
      } else {
        payload.profit = 0
      }
      if(!this.config.data) {
        this.dataService.addTrade(payload).then(() => {
          this.messageService.add({ severity: 'success', summary: 'Trade', detail: 'Trade Added Successfully!' });
        })
        .catch((error) => {
          console.error('Error adding document: ', error);
        });
      } else {
        this.dataService.updateTrade(this.config.data.id, payload).then(() => {
          this.messageService.add({ severity: 'success', summary: 'Trade', detail: 'Trade Updated Successfully!' });
        })
        .catch((error) => {
          console.error('Error adding document: ', error);
        });
      }
      
      this.ref.close()
    }
  }
}
