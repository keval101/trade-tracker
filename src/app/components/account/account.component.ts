import { Component } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { FundDialogComponent } from './fund-dialog/fund-dialog.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  newDate = new Date();
  visible = false;

  addFunds = [
    {
      date: '12/02/2024',
      fund: 1500
    },
    {
      date: '22/02/2024',
      fund: 2000
    }
  ]

  withdrawlFunds = [
    {
      date: '13/02/2024',
      fund: 1500
    },
    {
      date: '23/02/2024',
      fund: 1500
    },
    {
      date: '26/02/2024',
      fund: 500
    },
    {
      date: '27/02/2024',
      fund: 500
    }
  ]


  constructor(private dialogService: DialogService) {}

  openAddFundDialog() {
    const dialogRef = this.dialogService.open(FundDialogComponent, {
      data: {
        type: 'Add Fund'
      }
    })

    dialogRef.onClose.subscribe(() => console.log('Dialog Closed'))
  }
}
