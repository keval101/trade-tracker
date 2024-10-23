import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-delete-stock',
  templateUrl: './delete-stock.component.html',
  styleUrls: ['./delete-stock.component.scss']
})
export class DeleteStockComponent {
  stock: any;
  constructor(
    private messageService: MessageService,
    private dataService: DataService,
    private dialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef
    ) {}

  ngOnInit(): void {
    this.stock = this.dialogConfig.data;
  }

  cancel() {
    this.dialogRef.close();
  }

  deleteStock() {
    this.dataService.deleteStock(this.stock.id).then(() => {
      this.messageService.add({ severity: 'success', summary: 'Stock', detail: 'Stock Deleted Successfully!' });
    })
    .catch((error) => {
      console.error('Error adding document: ', error);
    });
    
    this.dialogRef.close();
  }
}
