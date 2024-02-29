import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { FundDialogComponent } from './fund-dialog/fund-dialog.component';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit{
  newDate = new Date();
  visible = false;

  addFunds: any[] = []
  withdrawalFunds: any[] = [];

  totalAddedFunds = 0;
  totalWithdrawalFunds = 0;

  constructor(
    private dialogService: DialogService,
    private dataService: DataService
    ) {}

  ngOnInit(): void {
    this.getAddFunds();
    this.getWithdrawalFunds();
  }

  openAddFundDialog(type: string, fundData?: any) {
    const fund = fundData ? fundData : '';
    const dialogRef = this.dialogService.open(FundDialogComponent, {
      width: '30vw',
      header: type == 'add' ? 'Add Fund' : 'Add Withdrawal Fund',
      data: {fund, type}
    })

    dialogRef.onClose.subscribe(() => {
      this.getAddFunds();
      this.getWithdrawalFunds();
      dialogRef.destroy();
    })
  }

  getAddFunds() {
    this.addFunds = [];
    this.dataService.getAddFunds().subscribe(funds => {
      funds.sort((a, b) => {
        const dateA: any = new Date(a.date.split('/').reverse().join('/'));
        const dateB: any = new Date(b.date.split('/').reverse().join('/'));
        return dateA - dateB;
      });
      this.addFunds = funds;
      this.totalAddedFunds = this.addFunds.reduce((total, current) => total + current.fund, 0);
    })
  }

  getWithdrawalFunds() {
    this.withdrawalFunds = [];
    this.dataService.getWithdrawalFunds().subscribe(funds => {
      funds.sort((a, b) => {
        const dateA: any = new Date(a.date.split('/').reverse().join('/'));
        const dateB: any = new Date(b.date.split('/').reverse().join('/'));
        return dateA - dateB;
      });
      this.withdrawalFunds = funds;
      this.totalWithdrawalFunds = this.withdrawalFunds.reduce((total, current) => total + current.fund, 0);

    })
  }
}
