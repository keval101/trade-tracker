import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-sheet-delete',
  templateUrl: './sheet-delete.component.html',
  styleUrls: ['./sheet-delete.component.scss']
})
export class SheetDeleteComponent {

  sheet: any;
  constructor(
    private messageService: MessageService,
    private dataService: DataService,
    private dialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef
    ) {}

  ngOnInit(): void {
    this.sheet = this.dialogConfig.data.sheet;
  }

  cancel() {
    this.dialogRef.close();
  }

  deleteSheet() {
    this.dataService.deleteSheet(this.sheet.id).then(() => {
      this.messageService.add({ severity: 'success', summary: 'Sheet', detail: 'Sheet Deleted Successfully!' });
    })
    .catch((error) => {
      console.error('Error adding document: ', error);
    });
    
    this.dialogRef.close();
  }
}
