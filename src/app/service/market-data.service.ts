import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, Subscription } from 'rxjs';
import { NseDataService } from './nse-data.service';
import { catchError, switchMap, startWith } from 'rxjs/operators';
import { of } from 'rxjs';

export interface MarketIndex {
  indexName: string;
  last: number;
  percChange: number;
  previousClose: number;
}

@Injectable({
  providedIn: 'root'
})
export class MarketDataService {
  private marketDataSubject = new BehaviorSubject<MarketIndex[]>([]);
  public marketData$ = this.marketDataSubject.asObservable();
  private refreshSubscription: Subscription | null = null;
  
  // Key indices to display in marquee (in order of preference)
  private keyIndices = [
    'NIFTY 50',
    'NIFTY BANK',
    'NIFTY FIN SERVICE',
    'NIFTY MIDCAP 100'
  ];

  // Market holidays list (format: DD-MMM-YYYY)
  private holidays = [
    '15-Jan-2026', '26-Jan-2026', '03-Mar-2026', '26-Mar-2026', '31-Mar-2026',
    '03-Apr-2026', '14-Apr-2026', '01-May-2026', '28-May-2026', '26-Jun-2026',
    '14-Sep-2026', '02-Oct-2026', '20-Oct-2026', '10-Nov-2026', '24-Nov-2026', '25-Dec-2026'
  ];

  constructor(private nseDataService: NseDataService) {
    this.initializeMarketData();
  }

  private initializeMarketData() {
    // Fetch once immediately
    this.fetchMarketData().subscribe();
    
    // Check market status and set up refresh accordingly
    this.checkAndSetupRefresh();
    
    // Re-check market status every minute to start/stop auto-refresh
    interval(60000).subscribe(() => {
      this.checkAndSetupRefresh();
    });
  }

  private checkAndSetupRefresh() {
    const isMarketOpen = this.isMarketOpen();
    
    if (isMarketOpen) {
      // Market is open - start auto-refresh if not already running
      if (!this.refreshSubscription || this.refreshSubscription.closed) {
        this.startAutoRefresh();
      }
    } else {
      // Market is closed - stop auto-refresh and fetch once
      this.stopAutoRefresh();
      // Fetch once when market closes (to get final values)
      this.fetchMarketData().subscribe();
    }
  }

  private isMarketOpen(): boolean {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes; // Convert to minutes

    // Market hours: 9:15 AM (555 min) to 3:30 PM (930 min) IST
    const marketOpen = 9 * 60 + 15; // 9:15 AM = 555 minutes
    const marketClose = 15 * 60 + 30; // 3:30 PM = 930 minutes

    // Check if it's a weekend
    if (day === 0 || day === 6) {
      return false;
    }

    // Check if it's a holiday
    if (this.isHoliday(now)) {
      return false;
    }

    // Check if within trading hours
    return currentTime >= marketOpen && currentTime <= marketClose;
  }

  private isHoliday(date: Date): boolean {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const dateStr = `${day}-${month}-${year}`;
    return this.holidays.includes(dateStr);
  }

  private startAutoRefresh() {
    // Stop any existing refresh
    this.stopAutoRefresh();
    
    // Start auto-refresh every 30 seconds
    this.refreshSubscription = interval(30000)
      .pipe(
        startWith(0),
        switchMap(() => this.fetchMarketData()),
        catchError(error => {
          console.error('Error fetching market data:', error);
          return of([]);
        })
      )
      .subscribe();
  }

  private stopAutoRefresh() {
    if (this.refreshSubscription && !this.refreshSubscription.closed) {
      this.refreshSubscription.unsubscribe();
      this.refreshSubscription = null;
    }
  }

  private fetchMarketData(): Observable<MarketIndex[]> {
    return new Observable(observer => {
      this.nseDataService.marketData().subscribe({
        next: (response: any) => {
          let dataArray = [];
          
          // Handle different response structures
          if (response && response.data && Array.isArray(response.data)) {
            dataArray = response.data;
          } else if (Array.isArray(response)) {
            dataArray = response;
          }
          
          if (dataArray.length > 0) {
            const filteredData = this.filterKeyIndices(dataArray);
            this.marketDataSubject.next(filteredData);
            observer.next(filteredData);
          } else {
            observer.next([]);
          }
        },
        error: (error) => {
          console.error('Error fetching market data:', error);
          observer.next([]);
        }
      });
    });
  }

  private filterKeyIndices(data: any[]): MarketIndex[] {
    const filtered: MarketIndex[] = [];
    
    // Filter for key indices in the specified order
    this.keyIndices.forEach(indexName => {
      const index = data.find(item => item.indexName === indexName);
      
      if (index) {
        filtered.push({
          indexName: index.indexName,
          last: index.last || 0,
          percChange: index.percChange || 0,
          previousClose: index.previousClose || 0
        });
      }
    });

    // Try to find SENSEX if available (it might have a different name)
    if (!filtered.find(item => item.indexName.includes('SENSEX'))) {
      const sensex = data.find(item => 
        item.indexName?.toUpperCase().includes('SENSEX')
      );
      if (sensex) {
        filtered.push({
          indexName: sensex.indexName,
          last: sensex.last || 0,
          percChange: sensex.percChange || 0,
          previousClose: sensex.previousClose || 0
        });
      }
    }

    return filtered;
  }

  getMarketData(): MarketIndex[] {
    return this.marketDataSubject.value;
  }
}
