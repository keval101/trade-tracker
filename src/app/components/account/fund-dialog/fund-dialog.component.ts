import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-fund-dialog',
  templateUrl: './fund-dialog.component.html',
  styleUrls: ['./fund-dialog.component.scss']
})
export class FundDialogComponent {

  fundForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.fundForm = this.fb.group({
      date: [null, Validators.required],
      fund: [null, Validators.required]
    })
  }
}
