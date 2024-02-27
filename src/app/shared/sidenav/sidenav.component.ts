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
      route: 'dashboard'
    },
    {
      name: 'Account',
      route: 'account'
    },
    {
      name: 'Trades',
      route: 'trades'
    }
  ]
}
