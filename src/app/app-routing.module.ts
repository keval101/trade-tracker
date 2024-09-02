import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './components/account/account.component';
import { TradesComponent } from './components/trades/trades.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TradeSheetComponent } from './components/trade-sheet/trade-sheet.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { SignupComponent } from './components/signup/signup.component';
import { OverviewComponent } from './components/overview/overview.component';
import { HolidayListComponent } from './components/holiday-list/holiday-list.component';
import { CalculateStoplossComponent } from './components/calculate-stoploss/calculate-stoploss.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'trades',
    component: TradesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'sheet',
    component: TradeSheetComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'analytics',
    component: OverviewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'calculate-stoploss',
    component: CalculateStoplossComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'market-holidays',
    component: HolidayListComponent,
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: SignupComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
