import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-sheet-entry-dialog',
  templateUrl: './sheet-entry-dialog.component.html',
  styleUrls: ['./sheet-entry-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SheetEntryDialogComponent implements OnInit {
  sheetEntryForm: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private dataService: DataService,
    private ref: DynamicDialogRef,
    private datePipe: DatePipe,
    private messageService: MessageService) {}

  ngOnInit(): void {
    this.sheetEntryForm = this.fb.group({
      date: [null, Validators.required],
      profit: [null, Validators.required],
      // isAddedFund: [null, Validators.required],
      // isWithdrawalFund: [null, Validators.required],
      // fund: [null, Validators.required],
    })

    this.sheetEntryForm.reset();

    if(this.config.data.isEdit) {
      let date = this.config.data.selectedRow.date.split('/')
      date = `${date[1]}/${date[0]}/${date[2]}`
      this.config.data.selectedRow.date = this.datePipe.transform(new Date(date), 'dd/MM/yyyy');
      this.sheetEntryForm.patchValue(this.config.data.selectedRow)
    }
  }

  addSheetEntry() {
    if(this.sheetEntryForm.valid) {
      let entry;
      const data = this.config.data;
  
      if(!data.isEdit) {
        const formatedDate = this.datePipe.transform(this.sheetEntryForm.value.date, 'dd/MM/yyyy')
        entry = {
          date: formatedDate,
          profit: this.sheetEntryForm.value.profit
        }
      } else {
        const formatedDate = typeof(this.sheetEntryForm.value.date) != 'string' ? this.datePipe.transform(this.sheetEntryForm.value.date, 'dd/MM/yyyy') : this.sheetEntryForm.value.date
        entry = {
          date: formatedDate,
          profit: this.sheetEntryForm.value.profit
        }
      }
  
      if(!data.isEdit) {    
        data.sheet.data = [...data.sheet.data, entry];
        delete data.sheet.expectedSheet
      } else {
        const index = data.sheet.data.findIndex(x => x.date == this.config.data.selectedRow.date);
        data.sheet.data[index] = entry;
      }
  
      const payload = !data.isEdit ? data.sheet : data.sheet;
      const sheetId = !data.isEdit ? data.sheet.id : data.sheet.id;
      this.dataService.updateSheet(sheetId, payload).then(() => {
        this.messageService.add({ severity: 'success', summary: 'Update Sheet', detail: 'Sheet Updated Successfully!' });
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
  
      this.ref.close();
    }
  }
}
