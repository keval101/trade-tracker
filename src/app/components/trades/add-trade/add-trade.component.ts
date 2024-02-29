import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DataService } from 'src/app/service/data.service';
@Component({
  selector: 'app-add-trade',
  templateUrl: './add-trade.component.html',
  styleUrls: ['./add-trade.component.scss']
})
export class AddTradeComponent implements OnInit{

  tradeForm: FormGroup;
  isEdit = false;

  @Output() emitModalClose = new EventEmitter()

  constructor(
    private fb: FormBuilder,
    public config: DynamicDialogConfig,
    public dataService: DataService,
    public ref: DynamicDialogRef) {}

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
      this.dataService.addTrade(this.tradeForm.value).then()
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
    } else {
      this.dataService.udpateData(this.config.data.id, this.tradeForm.value).then()
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
    }
    
    this.ref.close()
  }
}
