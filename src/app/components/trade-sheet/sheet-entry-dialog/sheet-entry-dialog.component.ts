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
      this.sheetEntryForm.patchValue(this.config.data.selectedRow)
    }
  }

  addSheetEntry() {
    const formatedDate = this.datePipe.transform(this.sheetEntryForm.value.date, 'dd/MM/yyyy')
    const entry = {
      date: formatedDate,
      profit: this.sheetEntryForm.value.profit
    }

    const sheet = this.config.data;
    sheet.data = [...sheet.data, entry];
    delete sheet.expectedSheet

    this.dataService.updateSheet(sheet.id, sheet).then(() => {
      this.messageService.add({ severity: 'success', summary: 'Update Sheet', detail: 'Sheet Updated Successfully!' });
    })
    .catch((error) => {
      console.error('Error adding document: ', error);
    });

    this.ref.close();
  }
}
