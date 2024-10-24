import { Component } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {

  navigations = [
    {
      name: 'Dashboard',
      route: 'dashboard',
      icon: '/assets/icons/dashboard.svg'
    },
    {
      name: 'Account',
      route: 'account',
      icon: '/assets/icons/account.svg'
    },
    {
      name: 'Trades',
      route: 'trades',
      icon: '/assets/icons/swap.svg'
    },
    {
      name: 'Sheet',
      route: 'sheet',
      icon: '/assets/icons/sheet.svg'
    },
    {
      name: 'Stocks',
      route: 'stocks',
      icon: '/assets/icons/savings.svg'
    },
    {
      name: 'Stoploss Calculator',
      route: 'calculate-stoploss',
      icon: '/assets/icons/calculator.svg'
    },
    {
      name: 'Analytics',
      route: 'analytics',
      icon: '/assets/icons/analytics.svg'
    },
    {
      name: 'Market Holidays',
      route: 'market-holidays',
      icon: '/assets/icons/sleeping-facecom.svg'
    }
  ]
}
