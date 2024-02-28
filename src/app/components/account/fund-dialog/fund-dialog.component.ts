import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-fund-dialog',
  templateUrl: './fund-dialog.component.html',
  styleUrls: ['./fund-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FundDialogComponent {

  fundForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public config: DynamicDialogConfig) {}

  ngOnInit() {
    this.fundForm = this.fb.group({
      date: [null, Validators.required],
      fund: [null, Validators.required]
    })

    if(this.config.data) {
      this.fundForm.patchValue(this.config.data)
    }
  }
}
