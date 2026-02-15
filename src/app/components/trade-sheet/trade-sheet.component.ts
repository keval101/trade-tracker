import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { DataService } from 'src/app/service/data.service';
import { SheetFormComponent } from './sheet-form/sheet-form.component';
import { SheetEntryDialogComponent } from './sheet-entry-dialog/sheet-entry-dialog.component';
import { SheetDeleteComponent } from './sheet-delete/sheet-delete.component';
import { AddTradeComponent } from '../trades/add-trade/add-trade.component';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-trade-sheet',
  templateUrl: './trade-sheet.component.html',
  styleUrls: ['./trade-sheet.component.scss']
})
export class TradeSheetComponent implements OnInit{

  sheets: any[] = [];
  markets: any[] = [
    {
      name: 'Nifty',
      lot: 65
    },
    {
      name: 'Bank Nifty',
      lot: 30
    },
    {
      name: 'Fin Nifty',
      lot: 60
    },
    {
      name: 'MidCap Nifty',
      lot: 120
    },
    {
      name: 'Sensex',
      lot: 20
    }
  ]
  selectedMarket = { name: 'Fin Nifty', lot: 40}
  isShortSheets: boolean = true;
  totalTargetAchievedSheets = 0
  showInstructions: boolean = false;
  
  constructor(
    private dialogService: DialogService,
    private dataService: DataService) {}
    
  ngOnInit(): void {
    this.getSheets();
  }

  getSheets() {
    this.dataService.getSheet().pipe(debounceTime(500)).subscribe(sheets => {
      this.totalTargetAchievedSheets = 0;
      sheets.map((sheet, index) => {
        sheet['expectedSheet'] = this.generateSheet(sheet)
        sheet['number'] = index + 1;
        if(sheet) {
          sheet['targetAchieved'] = sheet.data.length == sheet.days ? sheet.expectedSheet[sheet.days - 1].finalCapital >= +this.calculateCapital(sheet.capital, sheet.roi, sheet.days) ? true : false : null;

          if(sheet.data.length && sheet.expectedSheet[sheet.data.length - 1]?.finalCapital < 0) {
            sheet['targetAchieved'] = false;
          }
        }
        if(sheet.targetAchieved === true) {
          this.totalTargetAchievedSheets = this.totalTargetAchievedSheets + 1
        }
      })
      sheets.sort((a, b) => {
        const dateA: any = new Date(a.date.split('/').reverse().join('/'));
        const dateB: any = new Date(b.date.split('/').reverse().join('/'));
        return dateA - dateB;
      });
      sheets.map((x, index) => x['number'] = index + 1)
      this.sheets = sheets;
      console.log('sheets', this.sheets);
      this.shortSheets();
    })
  }

  shortSheets() {
    this.sheets = this.sheets.reverse();
    this.isShortSheets = !this.isShortSheets
  }

  generateSheet(sheet: any) {
    const data = [];
    let capital = sheet.capital;
    for (let i = 1; i <= sheet.days; i++) {
      const profit = (capital * sheet.roi) / 100;
      const index = i - 1;
      const startingCapital = i == 1 ? +capital : +data[index - 1]?.finalCapital;
      
      // Calculate actual profit/loss for this entry
      let actualProfitLoss = 0;
      if (sheet.data[index]?.profit) {
        actualProfitLoss = +sheet.data[index].profit;
      } else if (sheet.data[index]?.lose) {
        actualProfitLoss = -sheet.data[index].lose;
      }
      
      // Calculate final capital based on profit or loss
      let finalCapital = startingCapital;
      if (sheet.data[index]) {
        // Entry exists - add profit or subtract loss
        finalCapital = startingCapital + actualProfitLoss;
      } else if (index > 0 && data[index - 1]) {
        // No entry yet, carry forward previous final capital
        finalCapital = data[index - 1].finalCapital;
      } else if (index === 0) {
        // First day with no entry
        finalCapital = startingCapital;
      }
      
      const object = {
        capital: capital,
        expectedProfit: profit,
        profit: actualProfitLoss,
        date: sheet.data[index]?.date ? sheet.data[index].date : '-',
        startingCapital: startingCapital,
        finalCapital: finalCapital
      }
      capital += profit;
      if(sheet.data[index]?.tradeId) {
        object['tradeId'] = sheet.data[index].tradeId
      }
      data.push(object)
    }
    return data;
  }
  

  addSheet() {
    const dialogRef = this.dialogService.open(SheetFormComponent, {
      width: window.innerWidth < 600 ? '90%' : '500px',
      header: "Generate Sheet"
    })

    dialogRef.onClose.subscribe((result) => {
      if (result?.submitted) this.getSheets();
      dialogRef.destroy();
    });
  }

  calculateCapital(initialCapital, roi, days) {
    let capital = initialCapital;
    for (let i = 1; i <= days; i++) {
        const profit = (capital * roi) / 100;
        capital += profit;
    }
    return capital.toFixed(2);
  }

  addSheetEntry(sheet: any) {
    this.dialogService.open(AddTradeComponent, {
      width: window.innerWidth < 600 ? '90%' : '500px',
      // data: sheet,
      data: {sheet, isSheetEntry: true},
      header: 'Add Trade'
    })
  }

  updateSheetEntry(sheet: any, selectedRow: any) {
    if(!selectedRow.date.includes('-')) {
      this.dialogService.open(AddTradeComponent, {
        width: window.innerWidth < 600 ? '90%' : '500px',
        data: {sheet, selectedRow, isSheetEntry: true, isEdit: true},
        header: 'Edit Trade',
      })
    }
  }

  onMarketSelect(sheet, market) {
    sheet.market = market;
  }

  deleteSheet(sheet: any) {
    const dialogRef = this.dialogService.open(SheetDeleteComponent, {
      width: window.innerWidth < 600 ? '90%' : '500px',
      header: 'Delete Sheet',
      data: {sheet}
    })

    dialogRef.onClose.subscribe((result) => {
      if (result?.submitted) this.getSheets();
      dialogRef.destroy();
    });
  }
}
