import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-delete-fund',
  templateUrl: './delete-fund.component.html',
  styleUrls: ['./delete-fund.component.scss']
})
export class DeleteFundComponent {

  fund: any;
  type: any
  constructor(
    private messageService: MessageService,
    private dataService: DataService,
    private dialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef
    ) {}

  ngOnInit(): void {
    this.fund = this.dialogConfig.data.fund;
    this.type = this.dialogConfig.data.type;
  }

  cancel() {
    this.dialogRef.close();
  }

  deleteTrade() {
    this.dataService.deleteFund(this.fund.id, this.type).then(() => {
      this.messageService.add({ severity: 'success', summary: 'Fund', detail: 'Fund Deleted Successfully!' });
    })
    .catch((error) => {
      console.error('Error adding document: ', error);
    });
    
    this.dialogRef.close();
  }
}
