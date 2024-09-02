import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-calculate-stoploss',
  templateUrl: './calculate-stoploss.component.html',
  styleUrls: ['./calculate-stoploss.component.scss']
})
export class CalculateStoplossComponent {

  public stoplossForm: FormGroup;
  public customStoplossLimit: boolean;
  public stopLossPrice: number;
  constructor(private fb: FormBuilder) {
    
  }

  ngOnInit() {
    this.stoplossForm = this.fb.group({
      amount: [0, Validators.required],
      stoploss: [0, Validators.required],
      quantity: [0, Validators.required],
    })
  }

  setStoplossLimit(limit) {
    this.stoplossForm.get('stoploss').setValue(limit)
    console.log(this.stoplossForm.value)
    this.customStoplossLimit = false;
  }

  calculateStopLoss() {
    console.log(this.stoplossForm.value)
    const data = this.stoplossForm.value
    const stopLossDecimal = (data.stoploss / 100);
    const stopLossPrice = data.amount * (1 - stopLossDecimal);
    this.stopLossPrice = stopLossPrice;
    return stopLossPrice;

  }
}
