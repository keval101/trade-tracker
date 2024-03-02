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
    private messageService: MessageService) {}

  ngOnInit(): void {
    this.tradeForm = this.fb.group({
      date: ['12/02/2024', Validators.required],
      totalTrades: [null, Validators.required],
      market: [null, Validators.required],
      investment: [null, Validators.required],
      isProfitable: [null, Validators.required],
      profit: [null],
      lose: [null],
      brokerage: [null, Validators.required]
    })

    if(this.config.data) {
      this.tradeForm.patchValue(this.config.data)
    }
  }

  addTrade() {
    if(!this.config.data) {
      this.dataService.addTrade(this.tradeForm.value).then(() => {
        this.messageService.add({ severity: 'success', summary: 'Trade', detail: 'Trade Added Successfully!' });
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
    } else {
      this.dataService.updateTrade(this.config.data.id, this.tradeForm.value).then(() => {
        this.messageService.add({ severity: 'success', summary: 'Trade', detail: 'Trade Updated Successfully!' });
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
    }
    
    this.ref.close()
  }
}
