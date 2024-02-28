import { Component } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { FundDialogComponent } from './fund-dialog/fund-dialog.component';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  newDate = new Date();
  visible = false;

  addFunds = this.dataService.addFunds
  withdrawlFunds = this.dataService.withdrawlFunds

  constructor(
    private dialogService: DialogService,
    private dataService: DataService
    ) {}

  openAddFundDialog(fundData?: any) {
    const fund = fundData ? fundData : '';
    const dialogRef = this.dialogService.open(FundDialogComponent, {
      width: '30vw',
      header: 'Add Fund',
      data: fund
    })

    dialogRef.onClose.subscribe(() => console.log('Dialog Closed'))
  }
}
