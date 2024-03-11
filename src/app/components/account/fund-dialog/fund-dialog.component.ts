import { DatePipe } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
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
    private datePipe: DatePipe,
    private messageService: MessageService) {}

  ngOnInit() {
    this.fundForm = this.fb.group({
      date: [null, Validators.required],
      fund: [null, Validators.required]
    })

    if(this.config.data.fund) {
      let date = this.config.data.fund.date.split('/')
      date = `${date[1]}/${date[0]}/${date[2]}`
      this.config.data.fund.date = this.datePipe.transform(new Date(date), 'dd/MM/yyyy');
      this.fundForm.patchValue(this.config.data.fund)
    }
  }

  submit() {
    if(this.fundForm.valid) {
      const formatedDate = typeof(this.fundForm.value.date) != 'string' ? this.datePipe.transform(this.fundForm.value.date, 'dd/MM/yyyy') : this.fundForm.value.date
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
  }

  submitFund(payload) {
    if(!this.config.data) {
      this.dataService.addFund(payload).then(() => {
        this.messageService.add({ severity: 'success', summary: 'Add Funds', detail: 'Funds Added Successfully!' });
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
    } else {
      this.dataService.updateFund(this.config.data.fund.id, payload).then(() => {
        this.messageService.add({ severity: 'success', summary: 'Add Funds', detail: 'Funds Updated Successfully!' });
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
    }
  }

  submitWithdrawalFund(payload) {
    if(!this.config.data) {
      this.dataService.addWithdrawalFund(payload).then(() => {
        this.messageService.add({ severity: 'success', summary: 'Withdrawal Funds', detail: 'Funds Withdrawal Added Successfully!' });
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
    } else {
      this.dataService.updateWithdrawalFund(this.config.data.fund.id, payload).then(() => {
        this.messageService.add({ severity: 'success', summary: 'Withdrawal Funds', detail: 'Funds Withdrawal Updated Successfully!' });
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
    }
  }
}
