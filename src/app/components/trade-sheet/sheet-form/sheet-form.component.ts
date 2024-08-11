import { DatePipe } from '@angular/common';
import { Component, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-sheet-form',
  templateUrl: './sheet-form.component.html',
  styleUrls: ['./sheet-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SheetFormComponent implements OnInit{
  sheetForm: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    public config: DynamicDialogConfig,
    public dataService: DataService,
    public ref: DynamicDialogRef,
    private datePipe: DatePipe,
    private messageService: MessageService) {}

  ngOnInit(): void {
    this.sheetForm = this.fb.group({
      date: [null, Validators.required],
      capital: [null, Validators.required],
      roi: [null, Validators.required],
      days: [null, Validators.required]
    })

    if(this.config.data) {
      this.sheetForm.patchValue(this.config.data)
    }
  }

  addSheet() {
    if(this.sheetForm.valid) {
      const payload = this.sheetForm.value
      payload.date = this.datePipe.transform(this.sheetForm.value.date, 'dd/MM/yyyy')
      payload['data'] = [];
      this.dataService.addSheet(this.sheetForm.value).then(() => {
        this.messageService.add({ severity: 'success', summary: 'Add Sheet', detail: 'Sheet Added Successfully!' });
        this.ref.close();
      })
    }
  }
}
