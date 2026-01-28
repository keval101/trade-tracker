import { Component, OnInit, OnDestroy } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { DataService } from './service/data.service';
import { Router } from '@angular/router';
import { AuthService } from './service/auth.service';
import { MarketDataService, MarketIndex } from './service/market-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'paper-trading';
  isLoginPage = false;
  marketData: MarketIndex[] = [];
  private marketDataSubscription: Subscription;

  constructor(
    private router: Router,
    public authService: AuthService,
    private marketDataService: MarketDataService
  ) {}

  ngOnInit() {
    initFlowbite();
    setTimeout(() => {
      this.isLoginPage = this.router.url.includes('/login') || this.router.url.includes('/register');
    }, 50);

    this.authService.getCurrentUserDetail().subscribe(res => {
      if(!res) {
        this.router.url.includes('/login')
        return;
      }
      localStorage.setItem('preferredMarket', res.preferredMarket)
    });

    // Initialize live market data (dev uses Angular proxy, prod uses Vercel serverless)
    this.marketDataService.initializeMarketData();

    // Subscribe to market data for marquee
    this.marketDataSubscription = this.marketDataService.marketData$.subscribe(data => {
      this.marketData = data;
    });
  }

  ngOnDestroy() {
    if (this.marketDataSubscription) {
      this.marketDataSubscription.unsubscribe();
    }
  }

  checkForLoginPage() {
    this.isLoginPage = this.router.url.includes('/login') || this.router.url.includes('/register');
  }

  getMarketDisplayName(indexName: string): string {
    const nameMap: { [key: string]: string } = {
      'NIFTY 50': 'NIFTY',
      'NIFTY BANK': 'BANKNIFTY',
      'NIFTY FIN SERVICE': 'FINNIFTY',
      'NIFTY MIDCAP 100': 'MIDCAP',
    };
    return nameMap[indexName] || indexName;
  }
}
