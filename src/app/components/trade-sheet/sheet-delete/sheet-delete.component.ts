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
  deleting = false;

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
    this.deleting = true;
    this.dataService.deleteSheetAndTrades(this.sheet.id, this.sheet).then(() => {
      this.messageService.add({ severity: 'success', summary: 'Sheet', detail: 'Sheet and its trades deleted successfully!' });
      this.dialogRef.close({ submitted: true });
    })
    .catch((error) => {
      console.error('Error deleting sheet: ', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete sheet.' });
      this.deleting = false;
    });
  }
}
