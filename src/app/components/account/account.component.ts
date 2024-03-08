import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { FundDialogComponent } from './fund-dialog/fund-dialog.component';
import { DataService } from 'src/app/service/data.service';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';

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

  user: any;

  constructor(
    private dialogService: DialogService,
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
    ) {}

  ngOnInit(): void {
    this.getAddFunds();
    this.getWithdrawalFunds();

    this.authService.getCurrentUserDetail().subscribe(res => {
      this.user = res;
    })
  }

  openAddFundDialog(type: string, fundData?: any) {
    const fund = fundData ? fundData : '';
    const dialogRef = this.dialogService.open(FundDialogComponent, {
      width: window.screen.availWidth < 992 ? '80vw' : '30vw',
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

  logout() {
    this.authService.signOut();
    this.router.navigate(['/login'])
    this.messageService.add({ severity: 'success', summary: 'Logged Out', detail: 'Logged Out Successfully!' });
  }
}
