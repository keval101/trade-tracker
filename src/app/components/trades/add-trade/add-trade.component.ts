import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DataService } from 'src/app/service/data.service';
@Component({
  selector: 'app-add-trade',
  templateUrl: './add-trade.component.html',
  styleUrls: ['./add-trade.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddTradeComponent implements OnInit{

  tradeForm: FormGroup;
  isEdit = false;
  selectedTags: string[] = [];
  availableTags = ['Breakout', 'Reversal', 'Mistake', 'Scalping', 'Swing', 'Trend Following', 'Support/Resistance', 'News Based', 'Gap Trade', 'Other'];

  @Output() emitModalClose = new EventEmitter()

  constructor(
    private fb: FormBuilder,
    public config: DynamicDialogConfig,
    public dataService: DataService,
    public ref: DynamicDialogRef,
    private messageService: MessageService,
    private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.tradeForm = this.fb.group({
      date: [null, Validators.required],
      totalTrades: [null, Validators.required],
      market: [null, Validators.required],
      investment: [null, Validators.required],
      isProfitable: [false, Validators.required],
      profit: [0],
      lose: [0],
      brokerage: [0, Validators.required],
      notes: [''],
      tags: [[]]
    })

    const preferredMarket = localStorage.getItem('preferredMarket');
    if(preferredMarket) {
      this.tradeForm.get('market').setValue(preferredMarket);
    }
    if(this.config.data.trade) {
      // Editing existing trade - use the trade's isProfitable value
      let date = this.config.data.trade.date.split('/');
      date = `${date[1]}/${date[0]}/${date[2]}`;
      this.config.data.trade.date = this.datePipe.transform(new Date(date), 'dd/MM/yyyy');
      this.tradeForm.patchValue(this.config.data.trade)
      this.tradeForm.get('isProfitable').setValue(this.config.data.trade.isProfitable ? true : false)
      
      // Load existing tags and notes
      if (this.config.data.trade.tags) {
        this.selectedTags = Array.isArray(this.config.data.trade.tags) ? this.config.data.trade.tags : [];
        this.tradeForm.get('tags').setValue(this.selectedTags);
      }
      if (this.config.data.trade.notes) {
        this.tradeForm.get('notes').setValue(this.config.data.trade.notes);
      }
    } else {
      // New trade - default to loss (isProfitable = false)
      this.tradeForm.get('isProfitable').setValue(false)
    }

    if(this.config.data.sheet) {
      const data = this.config.data.selectedRow ? this.config.data.sheet.data.find(x => x.date === this.config.data.selectedRow.date) : null;
      if(this.config.data.selectedRow && data) {
        // Editing existing sheet entry - use the entry's isProfitable value
        let date = data.date.split('/');
        date = `${date[1]}/${date[0]}/${date[2]}`;
        data.date = this.datePipe.transform(new Date(date), 'dd/MM/yyyy');
        this.tradeForm.patchValue(data)
        this.tradeForm.get('isProfitable').setValue(data.isProfitable ? true : false)
        
        // Load existing tags and notes for sheet entry
        if (data.tags) {
          this.selectedTags = Array.isArray(data.tags) ? data.tags : [];
          this.tradeForm.get('tags').setValue(this.selectedTags);
        }
        if (data.notes) {
          this.tradeForm.get('notes').setValue(data.notes);
        }
      } else {
        // New sheet entry - default to loss (isProfitable = false)
        this.tradeForm.get('isProfitable').setValue(false)
      }
    }

  }

  addTrade() {

    if(this.tradeForm.valid) {
      const payload = this.tradeForm.value;
      if(!this.config.data.trade) {
        const formatedDate = typeof(this.tradeForm.value.date) != 'string' ? this.datePipe.transform(this.tradeForm.value.date, 'dd/MM/yyyy') : this.tradeForm.value.date
        payload.date = formatedDate;
      } else {
        const formatedDate = typeof(this.tradeForm.value.date) != 'string' ? this.datePipe.transform(this.tradeForm.value.date, 'dd/MM/yyyy') : this.tradeForm.value.date
        payload.date = formatedDate;
      }
      if(payload.isProfitable) {
        payload.lose = 0
      } else {
        payload.profit = 0
      }
      if(!this.config.data.trade && !this.config.data.selectedRow) {
        this.addNewTrade(payload);
      } else {
        if (this.config.data.isSheetEntry && this.config.data.selectedRow && !this.config.data.selectedRow.tradeId) {
          this.updateTrade(payload);
          this.addSheetEntry();
        } else {
          this.updateTrade(payload);
          this.addSheetEntry(this.config.data.selectedRow.tradeId);
        }
      }
      
      this.ref.close()
    }
  }

  onTagToggle(tag: string) {
    const index = this.selectedTags.indexOf(tag);
    if (index > -1) {
      this.selectedTags.splice(index, 1);
    } else {
      this.selectedTags.push(tag);
    }
    this.tradeForm.get('tags').setValue([...this.selectedTags]);
  }


  addNewTrade(payload) {
    this.dataService.addTrade(payload).then((res) => {
      if(!this.config.data.selectedRow && this.config.data.isSheetEntry) {
        this.addSheetEntry(res?.id);
      }
      this.messageService.add({ severity: 'success', summary: 'Trade', detail: 'Trade Added Successfully!' });
    })
    .catch((error) => {
      console.error('Error adding document: ', error);
    });
  }

  updateTrade(payload) {
    let id;
    if(this.config.data?.trade?.id) {
      id = this.config.data.trade.id
    } else if(this.config.data?.selectedRow?.tradeId) {
      id = this.config.data.selectedRow.tradeId
    }
    this.dataService.updateTrade(id, payload).then(() => {
      this.messageService.add({ severity: 'success', summary: 'Trade', detail: 'Trade Updated Successfully!' });
    })
    .catch((error) => {
      console.error('Error adding document: ', error);
    });
  }

  addSheetEntry(id?: string) {
    if(this.tradeForm.valid) {
      let entry;
      const data = this.config.data;
      console.log('data', data);
  
      if(!data.isEdit) {
        const formatedDate = this.tradeForm.value.date
        entry = {
          ...this.tradeForm.value,
          date: formatedDate,
        }
      } else {
        const formatedDate = this.tradeForm.value.date
        entry = {
          ...this.tradeForm.value,
          date: formatedDate,
        }
      }
  
      if(id) {
        entry['tradeId'] = id
      }
      if(!data.isEdit) {    
        data.sheet.data = [...data.sheet.data, entry];
        delete data.sheet.expectedSheet
      } else {
        const index = data.sheet.data.findIndex(x => x.date == this.config.data.selectedRow.date);
        data.sheet.data[index] = entry;
      }
  
      const payload = data.sheet;
      const sheetId = data.sheet.id;
      console.log('payload', payload, entry);
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
