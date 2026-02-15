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
  private marketDataSubscription: Subscription | null = null;
  private userDetailSubscription: Subscription | null = null;

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

    this.userDetailSubscription = this.authService.getCurrentUserDetail().subscribe(res => {
      if (res?.preferredMarket) localStorage.setItem('preferredMarket', res.preferredMarket);
    });

    this.marketDataService.initializeMarketData();
    this.marketDataSubscription = this.marketDataService.marketData$.subscribe(data => {
      this.marketData = data;
    });
  }

  ngOnDestroy() {
    if (this.marketDataSubscription) { this.marketDataSubscription.unsubscribe(); this.marketDataSubscription = null; }
    if (this.userDetailSubscription) { this.userDetailSubscription.unsubscribe(); this.userDetailSubscription = null; }
  }

  checkForLoginPage() {
    this.isLoginPage = this.router.url.includes('/login') || this.router.url.includes('/register');
  }

  trackByMarketIndexName(_index: number, item: MarketIndex): string { return item?.indexName ?? String(_index); }

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
