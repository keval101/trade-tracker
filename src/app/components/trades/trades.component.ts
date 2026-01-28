import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { AddTradeComponent } from './add-trade/add-trade.component';
import { DataService } from 'src/app/service/data.service';
import { DeleteTradeComponent } from './delete-trade/delete-trade.component';

@Component({
  selector: 'app-trades',
  templateUrl: './trades.component.html',
  styleUrls: ['./trades.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TradesComponent implements OnInit {
  newDate = new Date();
  trades: any[] = [];
  filteredTrades: any[] = [];
  isLoading = true;
  tradeOverview: any;
  tradingAccuracy: any;
  isProfitableTrader = false;
  streakData: any;
  
  // Filter properties
  searchQuery: string = '';
  selectedTags: string[] = [];
  availableTags: string[] = [];
  showFilters: boolean = false;

  constructor(
    private dialogService: DialogService,
    private dataService: DataService) {}

  ngOnInit(): void {
    this.getTrades();
  }

  openTradeForm(trade?: any) {
    this.isProfitableTrader = (this.tradingAccuracy?.totalProfitableDays / this.tradingAccuracy?.totalDays) * 100 > 70 ? true : false;
    const dialogRef = this.dialogService.open(AddTradeComponent, {
      width: window.innerWidth < 600 ? '90%' : '500px',
      header: 'Add Trade',
      data: {trade, isProfitableTrader: this.isProfitableTrader}
    });

    dialogRef.onClose.subscribe(() => {
      this.getTrades();
      dialogRef.destroy();
    });
  }

  getTrades() {
    this.trades = [];
    this.filteredTrades = [];
    this.isLoading = true;
    this.dataService.getTrades().subscribe(trades => {
      trades.sort((a, b) => {
        const dateA: any = new Date(a.date.split('/').reverse().join('/'));
        const dateB: any = new Date(b.date.split('/').reverse().join('/'));
        return dateB - dateA;
      });
      this.trades = trades;
      this.filteredTrades = [...trades];
      console.log(this.trades);
      this.tradingAccuracy = this.calculateTotalDaysAndProfitableDays(this.trades)
      this.isLoading = false;
      this.streakData = this.countStreaks(trades);
      
      // Extract unique tags from all trades
      this.extractAvailableTags(trades);
      
      // Apply filters
      this.applyFilters();

      // Use Math.abs to handle any accidentally entered negative values
      const totalProfit = this.trades.reduce((total, current) => total + Math.abs(+current.profit || 0), 0)
      const totalLose = this.trades.reduce((total, current) => total + Math.abs(+current.lose || 0), 0)
      this.tradeOverview = {
        totalTrades: this.trades.reduce((total, current) => total + Math.abs(+current.totalTrades || 0), 0),
        brokerage: this.trades.reduce((total, current) => total + Math.abs(+current.brokerage || 0), 0),
        profitLose: totalProfit - totalLose,
      }

    },
    (error) => this.isLoading = false)
  }

  deleteTrade(trade: any) {
    const dialogRef = this.dialogService.open(DeleteTradeComponent, {
      width: window.innerWidth < 600 ? '90%' : '500px',
      header: 'Delete Trade',
      data: trade
    })

    dialogRef.onClose.subscribe(() => {
      this.getTrades();
      dialogRef.destroy();
    })
  }

  calculateMarketProfits(trades) {
    let marketProfits = {};

    trades.forEach(trade => {
        const { profit, lose, market, isProfitable } = trade;
        let profitValue = parseFloat(profit);
        let loseValue = parseFloat(lose);

        if (isNaN(profitValue)) profitValue = 0;
        if (isNaN(loseValue)) loseValue = 0;

        const formattedMarket = market.toLowerCase().replace(/\s+/g, '_');
        const tradeProfitLoss = isProfitable ? profitValue : -loseValue;

        if (!marketProfits[formattedMarket]) {
            marketProfits[formattedMarket] = tradeProfitLoss;
        } else {
            marketProfits[formattedMarket] += tradeProfitLoss;
        }
    });

    return marketProfits;
  }
  calculateTotalDaysAndProfitableDays(trades) {
    let totalDays = 0;
    let totalProfitableDays = 0;

    trades.forEach(trade => {
        const { isProfitable } = trade;

        // Increment total days count for each trade
        totalDays++;

        // Increment profitable days count if the trade is profitable
        if (isProfitable) {
            totalProfitableDays++;
        }
    });

    return {
        totalDays,
        totalProfitableDays
    };
  }

  countStreaks(trades) {
    let profitableStreak = 0;
    let losingStreak = 0;
    let currentStreakType = null;

    for (const trade of trades) {
        if (trade.isProfitable && (currentStreakType === null || currentStreakType === 'profitable')) {
            profitableStreak++;
            currentStreakType = 'profitable';
        } else if (!trade.isProfitable && (currentStreakType === null || currentStreakType === 'losing')) {
            losingStreak++;
            currentStreakType = 'losing';
        } else {
            break;
        }
    }

    return { profitableStreak, losingStreak };
  }

  // Helper method to get absolute value (handles negative values entered by mistake)
  abs(value: number): number {
    return Math.abs(value || 0);
  }

  extractAvailableTags(trades: any[]) {
    const tagSet = new Set<string>();
    trades.forEach(trade => {
      if (trade.tags && Array.isArray(trade.tags)) {
        trade.tags.forEach((tag: string) => tagSet.add(tag));
      }
    });
    this.availableTags = Array.from(tagSet).sort();
  }

  onTagFilterToggle(tag: string) {
    const index = this.selectedTags.indexOf(tag);
    if (index > -1) {
      this.selectedTags.splice(index, 1);
    } else {
      this.selectedTags.push(tag);
    }
    this.applyFilters();
  }

  onSearchChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedTags = [];
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.trades];

    // Filter by search query (searches in notes)
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(trade => 
        (trade.notes && trade.notes.toLowerCase().includes(query)) ||
        (trade.market && trade.market.toLowerCase().includes(query))
      );
    }

    // Filter by tags
    if (this.selectedTags.length > 0) {
      filtered = filtered.filter(trade => {
        if (!trade.tags || !Array.isArray(trade.tags)) return false;
        return this.selectedTags.some(tag => trade.tags.includes(tag));
      });
    }

    this.filteredTrades = filtered;
  }

  hasActiveFilters(): boolean {
    return this.searchQuery.trim().length > 0 || this.selectedTags.length > 0;
  }

  getFilteredSummary() {
    const filteredProfit = this.filteredTrades.reduce((total, current) => total + Math.abs(+current.profit || 0), 0);
    const filteredLoss = this.filteredTrades.reduce((total, current) => total + Math.abs(+current.lose || 0), 0);
    const filteredPL = filteredProfit - filteredLoss;
    const filteredBrokerage = this.filteredTrades.reduce((total, current) => total + Math.abs(+current.brokerage || 0), 0);
    const filteredTotalTrades = this.filteredTrades.reduce((total, current) => total + Math.abs(+current.totalTrades || 0), 0);
    
    return {
      totalTrades: filteredTotalTrades,
      profitLose: filteredPL,
      brokerage: filteredBrokerage
    };
  }

  toggleTradeDetails(trade: any) {
    trade.showDetails = !trade.showDetails;
  }

}
