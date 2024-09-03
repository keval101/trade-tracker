import { Component } from '@angular/core';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss']
})
export class StocksComponent {
  // Share Name
  // Share Code
  // Share Buy Price
  // Total Share Quantity
  // Total Amount
  // Share Sell Price
  
  // Total Profit per share
  // Total Profit
  // Total ROI

  public stocks = [
    {
      name: 'Jio Financial Services',
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/86/Jio_Financial_Services_Logo.svg/1200px-Jio_Financial_Services_Logo.svg.png',
      code: 'JIOFIN',
      link: 'https://www.screener.in/company/JIOFIN/consolidated/#analysis',
      buyPrice: 345.70,
      status: 'Hold',
      sellPrice: 0,
      totalQuantity: 29,
      totalAmount: 10025.3,
      profit: 0,
      lose: 0,
      roi: 0
    }
  ]
  constructor() {}
}
