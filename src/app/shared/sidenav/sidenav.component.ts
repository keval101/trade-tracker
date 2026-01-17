import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

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

  logout() {
    this.authService.signOut().then(() => {
      this.router.navigate(['/login']);
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Logged Out', 
        detail: 'Logged Out Successfully!' 
      });
    }).catch((error) => {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Logout Error', 
        detail: 'Failed to logout. Please try again.' 
      });
    });
  }
}
