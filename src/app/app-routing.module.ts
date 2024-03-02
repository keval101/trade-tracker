import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './components/account/account.component';
import { TradesComponent } from './components/trades/trades.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TradeSheetComponent } from './components/trade-sheet/trade-sheet.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'account',
    component: AccountComponent
  },
  {
    path: 'trades',
    component: TradesComponent
  },
  {
    path: 'sheet',
    component: TradeSheetComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
