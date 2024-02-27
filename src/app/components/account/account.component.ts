import { Component } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  newDate = new Date();

  addFunds = [
    {
      date: '12/02/2024',
      fund: 1500
    },
    {
      date: '22/02/2024',
      fund: 2000
    }
  ]

  withdrawlFunds = [
    {
      date: '13/02/2024',
      fund: 1500
    },
    {
      date: '23/02/2024',
      fund: 1500
    },
    {
      date: '26/02/2024',
      fund: 500
    },
    {
      date: '27/02/2024',
      fund: 500
    }
  ]
}
