import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { DataService } from 'src/app/service/data.service';
import { SheetFormComponent } from './sheet-form/sheet-form.component';
import { SheetEntryDialogComponent } from './sheet-entry-dialog/sheet-entry-dialog.component';

@Component({
  selector: 'app-trade-sheet',
  templateUrl: './trade-sheet.component.html',
  styleUrls: ['./trade-sheet.component.scss']
})
export class TradeSheetComponent implements OnInit{

  sheets: any[] = [];
  
  constructor(
    private dialogService: DialogService,
    private dataService: DataService) {}
    
  ngOnInit(): void {
    this.getSheets();
  }

  getSheets() {
    this.dataService.getSheet().subscribe(sheets => {
      this.sheets = sheets;
      this.sheets.map(sheet => {
        sheet['expectedSheet'] = this.generateSheet(sheet)
        if(sheet) {
          sheet['targetAchieved'] = sheet.data.length == sheet.days ? sheet.expectedSheet[sheet.days - 1].finalCapital >= +this.calculateCapital(sheet.capital, sheet.roi, sheet.days) ? true : false : null;
        }
      })
    })
  }

  generateSheet(sheet: any) {
    const data = [];
    let capital = sheet.capital;
    for (let i = 1; i <= sheet.days; i++) {
        const profit = (capital * sheet.roi) / 100;
        const index = i - 1;
        const startingCapital = i == 1 ? capital : data[index - 1]?.finalCapital;
        const object = {
          capital: capital,
          expectedProfit: profit,
          profit: sheet.data[index]?.profit ? sheet.data[index].profit : 0,
          date: sheet.data[index]?.date ? sheet.data[index].date : '-',
          startingCapital: startingCapital,
          finalCapital: sheet.data[index]?.profit ? startingCapital + sheet.data[index]?.profit : sheet.data.length ? data[index - 1].finalCapital : 0
        }
        capital += profit;
        data.push(object)
    }
    return data;
  }
  

  addSheet() {
    const dialogRef = this.dialogService.open(SheetFormComponent, {
      width: '30vw',
      header: "Generate Sheet"
    })

    dialogRef.onClose.subscribe(() => {
      this.getSheets();
      dialogRef.destroy();
    })
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
    this.dialogService.open(SheetEntryDialogComponent, {
      width: '30vw',
      data: sheet,
      header: 'Sheet Entry'
    })
  }

  updateSheetEntry(sheet: any, selectedRow: any) {
    this.dialogService.open(SheetEntryDialogComponent, {
      width: '30vw',
      data: {sheet, selectedRow, isEdit: true},
      header: 'Sheet Entry',
    })
  }
}
