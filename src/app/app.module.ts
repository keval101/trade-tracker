import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { AccountComponent } from './components/account/account.component';
import { TradesComponent } from './components/trades/trades.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddTradeComponent } from './components/trades/add-trade/add-trade.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { CalendarModule } from 'primeng/calendar';
import { FundDialogComponent } from './components/account/fund-dialog/fund-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    AccountComponent,
    TradesComponent,
    DashboardComponent,
    AddTradeComponent,
    FundDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    DynamicDialogModule,
    CalendarModule
  ],
  providers: [DialogService],
  bootstrap: [AppComponent]
})
export class AppModule { }
