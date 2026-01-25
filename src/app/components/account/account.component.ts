import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { FundDialogComponent } from './fund-dialog/fund-dialog.component';
import { DataService } from 'src/app/service/data.service';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { DeleteFundComponent } from './delete-fund/delete-fund.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

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
  activeTab: 'profile' | 'funds' | 'summary' = 'profile';

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
      width: window.innerWidth < 600 ? '90%' : '500px',
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
        return dateB - dateA;
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
        return dateB - dateA;
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

  deleteFund(fund: any, type: string) {
    const dialogRef = this.dialogService.open(DeleteFundComponent, {
      width: window.innerWidth < 600 ? '90%' : '500px',
      header: 'Delete Fund',
      data: {fund, type}
    })

    dialogRef.onClose.subscribe(() => {
      if(type == 'add-funds') {
        this.getAddFunds();
      } else {
        this.getWithdrawalFunds()
      }
      dialogRef.destroy();
    })
  }

  openEditProfileDialog() {
    const dialogRef = this.dialogService.open(EditProfileComponent, {
      width: window.innerWidth < 600 ? '90%' : '600px',
      header: 'Edit Profile',
      data: { user: this.user }
    })

    dialogRef.onClose.subscribe((updated) => {
      if (updated) {
        // Refresh user data
        this.authService.getCurrentUserDetail().subscribe(res => {
          this.user = res;
        })
      }
      dialogRef.destroy();
    })
  }
}
