import { Component, OnInit, OnDestroy } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { FundDialogComponent } from './fund-dialog/fund-dialog.component';
import { DataService } from 'src/app/service/data.service';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DeleteFundComponent } from './delete-fund/delete-fund.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  newDate = new Date();
  visible = false;

  addFunds: any[] = [];
  withdrawalFunds: any[] = [];
  totalAddedFunds = 0;
  totalWithdrawalFunds = 0;

  user: any;
  activeTab: 'profile' | 'funds' | 'summary' = 'profile';

  private addFundsSubscription: Subscription | null = null;
  private withdrawalFundsSubscription: Subscription | null = null;
  private userSubscription: Subscription | null = null;

  constructor(
    private dialogService: DialogService,
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.subscribeToAddFunds();
    this.subscribeToWithdrawalFunds();
    this.userSubscription = this.authService.getCurrentUserDetail().subscribe(res => {
      this.user = res;
    });
  }

  ngOnDestroy(): void {
    if (this.addFundsSubscription) { this.addFundsSubscription.unsubscribe(); this.addFundsSubscription = null; }
    if (this.withdrawalFundsSubscription) { this.withdrawalFundsSubscription.unsubscribe(); this.withdrawalFundsSubscription = null; }
    if (this.userSubscription) { this.userSubscription.unsubscribe(); this.userSubscription = null; }
  }

  private subscribeToAddFunds(): void {
    if (this.addFundsSubscription) this.addFundsSubscription.unsubscribe();
    this.addFundsSubscription = this.dataService.getAddFunds().subscribe(funds => {
      funds.sort((a, b) => {
        const dateA = new Date(a.date.split('/').reverse().join('/'));
        const dateB = new Date(b.date.split('/').reverse().join('/'));
        return dateB.getTime() - dateA.getTime();
      });
      this.addFunds = funds;
      this.totalAddedFunds = this.addFunds.reduce((total, current) => total + current.fund, 0);
    });
  }

  private subscribeToWithdrawalFunds(): void {
    if (this.withdrawalFundsSubscription) this.withdrawalFundsSubscription.unsubscribe();
    this.withdrawalFundsSubscription = this.dataService.getWithdrawalFunds().subscribe(funds => {
      funds.sort((a, b) => {
        const dateA = new Date(a.date.split('/').reverse().join('/'));
        const dateB = new Date(b.date.split('/').reverse().join('/'));
        return dateB.getTime() - dateA.getTime();
      });
      this.withdrawalFunds = funds;
      this.totalWithdrawalFunds = this.withdrawalFunds.reduce((total, current) => total + current.fund, 0);
    });
  }

  trackByFundId(_index: number, item: any): string { return item?.id ?? String(_index); }

  openAddFundDialog(type: string, fundData?: any): void {
    const fund = fundData ?? '';
    const dialogRef = this.dialogService.open(FundDialogComponent, {
      width: window.innerWidth < 600 ? '90%' : '500px',
      header: type === 'add' ? 'Add Fund' : 'Add Withdrawal Fund',
      data: { fund, type }
    });
    dialogRef.onClose.pipe(take(1)).subscribe(() => dialogRef.destroy());
  }

  logout(): void {
    this.authService.signOut();
    this.router.navigate(['/login']);
    this.messageService.add({ severity: 'success', summary: 'Logged Out', detail: 'Logged Out Successfully!' });
  }

  deleteFund(fund: any, type: string): void {
    const dialogRef = this.dialogService.open(DeleteFundComponent, {
      width: window.innerWidth < 600 ? '90%' : '500px',
      header: 'Delete Fund',
      data: { fund, type }
    });
    dialogRef.onClose.pipe(take(1)).subscribe(() => dialogRef.destroy());
  }

  openEditProfileDialog(): void {
    const dialogRef = this.dialogService.open(EditProfileComponent, {
      width: window.innerWidth < 600 ? '90%' : '600px',
      header: 'Edit Profile',
      data: { user: this.user }
    });
    dialogRef.onClose.pipe(take(1)).subscribe((updated) => {
      if (updated) {
        this.authService.getCurrentUserDetail().pipe(take(1)).subscribe(res => { this.user = res; });
      }
      dialogRef.destroy();
    });
  }
}
