import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {
  marketStatus: 'open' | 'closed' | 'holiday' = 'closed';
  marketStatusText: string = 'Closed';
  private statusInterval: any;

  // Market holidays list (format: DD-MMM-YYYY)
  private holidays = [
    '15-Jan-2026', '26-Jan-2026', '03-Mar-2026', '26-Mar-2026', '31-Mar-2026',
    '03-Apr-2026', '14-Apr-2026', '01-May-2026', '28-May-2026', '26-Jun-2026',
    '14-Sep-2026', '02-Oct-2026', '20-Oct-2026', '10-Nov-2026', '24-Nov-2026', '25-Dec-2026'
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.updateMarketStatus();
    // Update every minute
    this.statusInterval = setInterval(() => this.updateMarketStatus(), 60000);
  }

  ngOnDestroy() {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
    }
  }

  private updateMarketStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes; // Convert to minutes

    // Market hours: 9:15 AM (555 min) to 3:30 PM (930 min)
    const marketOpen = 9 * 60 + 15; // 9:15 AM = 555 minutes
    const marketClose = 15 * 60 + 30; // 3:30 PM = 930 minutes

    // Check if it's a weekend
    if (day === 0 || day === 6) {
      this.marketStatus = 'closed';
      this.marketStatusText = 'Weekend';
      return;
    }

    // Check if it's a holiday
    if (this.isHoliday(now)) {
      this.marketStatus = 'holiday';
      this.marketStatusText = 'Holiday';
      return;
    }

    // Check if within trading hours
    if (currentTime >= marketOpen && currentTime <= marketClose) {
      this.marketStatus = 'open';
      this.marketStatusText = 'Open';
    } else if (currentTime < marketOpen) {
      this.marketStatus = 'closed';
      const openIn = marketOpen - currentTime;
      const openHours = Math.floor(openIn / 60);
      const openMins = openIn % 60;
      this.marketStatusText = openHours > 0 ? `Opens in ${openHours}h ${openMins}m` : `Opens in ${openMins}m`;
    } else {
      this.marketStatus = 'closed';
      this.marketStatusText = 'Closed';
    }
  }

  private isHoliday(date: Date): boolean {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const dateStr = `${day}-${month}-${year}`;
    return this.holidays.includes(dateStr);
  }

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
