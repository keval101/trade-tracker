import { DatePipe } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-fund-dialog',
  templateUrl: './fund-dialog.component.html',
  styleUrls: ['./fund-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FundDialogComponent {

  fundForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public config: DynamicDialogConfig,
    private dataService: DataService,
    private ref: DynamicDialogRef,
    private datePipe: DatePipe) {}

  ngOnInit() {
    this.fundForm = this.fb.group({
      date: [null, Validators.required],
      fund: [null, Validators.required]
    })

    if(this.config.data) {
      this.fundForm.patchValue(this.config.data)
    }
  }

  submit() {
    const formatedDate = this.datePipe.transform(this.fundForm.value.date, 'dd/MM/yyyy')
    const payload = {
      date: formatedDate,
      fund: this.fundForm.value.fund
    }
    if(this.config.data.type === 'add') {
      this.submitFund(payload);
    } else if (this.config.data.type === 'withdrawal') {
      this.submitWithdrawalFund(payload); 
    }

    this.ref.close()
  }

  submitFund(payload, ) {
    if(!this.config.data) {
      this.dataService.addFund(payload).then()
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
    } else {
      this.dataService.updateFund(this.config.data.fund.id, payload).then()
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
    }
  }

  submitWithdrawalFund(payload, ) {
    if(!this.config.data) {
      this.dataService.addWithdrawalFund(payload).then()
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
    } else {
      this.dataService.updateWithdrawalFund(this.config.data.fund.id, payload).then()
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
    }
  }
}
