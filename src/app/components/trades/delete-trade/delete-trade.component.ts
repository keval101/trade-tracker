import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-delete-trade',
  templateUrl: './delete-trade.component.html',
  styleUrls: ['./delete-trade.component.scss']
})
export class DeleteTradeComponent implements OnInit{

  trade: any;
  constructor(
    private messageService: MessageService,
    private dataService: DataService,
    private dialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef
    ) {}

  ngOnInit(): void {
    this.trade = this.dialogConfig.data;
  }

  cancel() {
    this.dialogRef.close();
  }

  deleteTrade() {
    this.dataService.deleteTrade(this.trade.id).then(() => {
      this.messageService.add({ severity: 'success', summary: 'Trade', detail: 'Trade Deleted Successfully!' });
    })
    .catch((error) => {
      console.error('Error adding document: ', error);
    });
    
    this.dialogRef.close();
  }
  
}
