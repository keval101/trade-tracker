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
import { FundDialogComponent } from './components/account/fund-dialog/fund-dialog.component';

//primeng
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { ChartModule } from 'primeng/chart';
import { TooltipModule } from 'primeng/tooltip';
import { KnobModule } from 'primeng/knob';

// Firebase Modules
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { DeleteTradeComponent } from './components/trades/delete-trade/delete-trade.component';
import { TradeSheetComponent } from './components/trade-sheet/trade-sheet.component';
import { SheetFormComponent } from './components/trade-sheet/sheet-form/sheet-form.component';
import { SheetEntryDialogComponent } from './components/trade-sheet/sheet-entry-dialog/sheet-entry-dialog.component';
import { LogoComponent } from './shared/logo/logo.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { LoginComponent } from './components/login/login.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { SignupComponent } from './components/signup/signup.component';
import { DeleteFundComponent } from './components/account/delete-fund/delete-fund.component';
import { OverviewComponent } from './components/overview/overview.component';
import { SheetDeleteComponent } from './components/trade-sheet/sheet-delete/sheet-delete.component';
import { HolidayListComponent } from './components/holiday-list/holiday-list.component';
import { CalculateStoplossComponent } from './components/calculate-stoploss/calculate-stoploss.component';
import { StocksComponent } from './components/stocks/stocks.component';
import { AddStockComponent } from './components/stocks/add-stock/add-stock.component';
import { DeleteStockComponent } from './components/stocks/delete-stock/delete-stock.component';

const firebaseConfig = {
  apiKey: "AIzaSyA7OCANxXbgxUiQ_0zB_co_22z3jgxJiFY",
  authDomain: "paper-trade-5c9d7.firebaseapp.com",
  databaseURL: "https://paper-trade-5c9d7-default-rtdb.firebaseio.com",
  projectId: "paper-trade-5c9d7",
  storageBucket: "paper-trade-5c9d7.appspot.com",
  messagingSenderId: "1020706193249",
  appId: "1:1020706193249:web:0a4452766cf34844810f20",
  measurementId: "G-FZXX60P22Q"
};

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    AccountComponent,
    TradesComponent,
    DashboardComponent,
    AddTradeComponent,
    FundDialogComponent,
    DeleteTradeComponent,
    TradeSheetComponent,
    SheetFormComponent,
    SheetEntryDialogComponent,
    LogoComponent,
    LoginComponent,
    SignupComponent,
    DeleteFundComponent,
    OverviewComponent,
    SheetDeleteComponent,
    HolidayListComponent,
    CalculateStoplossComponent,
    StocksComponent,
    AddStockComponent,
    DeleteStockComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    DynamicDialogModule,
    CalendarModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    ProgressSpinnerModule,
    ToastModule,
    ChartModule,
    TooltipModule,
    AngularFireAuthModule,
    KnobModule
  ],
  providers: [
    DialogService, DatePipe, MessageService, 
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
    }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
