import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
@Component({
  selector: 'app-add-trade',
  templateUrl: './add-trade.component.html',
  styleUrls: ['./add-trade.component.scss']
})
export class AddTradeComponent implements OnInit{

  tradeForm: FormGroup;
  isEdit = false;

  @Output() emitFormData = new EventEmitter()

  constructor(
    private fb: FormBuilder,
    public config: DynamicDialogConfig) {}

  ngOnInit(): void {
    this.tradeForm = this.fb.group({
      date: [null, Validators.required],
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
    console.log(this.tradeForm.value)
    this.emitFormData.emit(this.tradeForm.value)
  }
}
