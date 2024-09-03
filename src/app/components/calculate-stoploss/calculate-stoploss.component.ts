import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-calculate-stoploss',
  templateUrl: './calculate-stoploss.component.html',
  styleUrls: ['./calculate-stoploss.component.scss']
})
export class CalculateStoplossComponent {

  public stoplossForm: FormGroup;
  public targetForm: FormGroup;
  public customStoplossLimit: boolean;
  public customTargetLimit: boolean;
  public stopLossPrice: number;
  public targetPrice: number;
  constructor(private fb: FormBuilder) {
    
  }

  ngOnInit() {
    this.stoplossForm = this.fb.group({
      amount: [0, Validators.required],
      stoploss: [0, Validators.required],
      quantity: [0, Validators.required],
    })

    this.targetForm = this.fb.group({
      amount: [0, Validators.required],
      target: [0, Validators.required],
      quantity: [0, Validators.required],
    })
  }

  setStoplossLimit(limit) {
    this.stoplossForm.get('stoploss').setValue(limit)
    this.customStoplossLimit = false;
  }

  setTargetLimit(limit) {
    this.targetForm.get('target').setValue(limit)
    this.customTargetLimit = false;
  }

  calculateStopLoss() {
    const data = this.stoplossForm.value
    const stopLossDecimal = (data.stoploss / 100);
    const stopLossPrice = data.amount * (1 - stopLossDecimal);
    this.stopLossPrice = stopLossPrice;
    return stopLossPrice;
  }

  calculateTargetPrice() {
    const data = this.targetForm.value;
    const targetDecimal = (data.target / 100);
    const targetPrice = data.amount * (1 + targetDecimal);
    this.targetPrice = targetPrice;
    return targetPrice;
}
}
