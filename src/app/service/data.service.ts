import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

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
    },
    {
      date: '28/02/2024',
      fund: 200
    }
  ]

  trades: any[] = [
    {
      date: '12/02/2024',
      totalTrades: 24,
      market: 'MidCap Nifty',
      investment: 1500,
      isProfitable: true,
      profit: 1725,
      lose: null,
      brokerage: 62,
    },
    {
      date: '13/02/2024',
      totalTrades: 24,
      market: 'Nifty',
      investment: 1663,
      isProfitable: true,
      profit: 1162,
      lose: null,
      brokerage: 91,
    },
    {
      date: '14/02/2024',
      totalTrades: 24,
      market: 'Nifty',
      investment: 2825,
      isProfitable: false,
      profit: null,
      lose: 310,
      brokerage: 88,
    },
    {
      date: '15/02/2024',
      totalTrades: 24,
      market: 'Nifty',
      investment: 2515,
      isProfitable: true,
      profit: 658,
      lose: null,
      brokerage: 0,
    },
    {
      date: '16/02/2024',
      totalTrades: 24,
      market: 'Nifty',
      investment: 3173,
      isProfitable: false,
      profit: null,
      lose: 208,
      brokerage: 0,
    },
    {
      date: '19/02/2024',
      totalTrades: 24,
      market: 'Nifty',
      investment: 2965,
      isProfitable: false,
      profit: null,
      lose: 1500,
      brokerage: 0,
    },
    {
      date: '20/02/2024',
      totalTrades: 24,
      market: 'Fin Nifty',
      investment: 1465,
      isProfitable: true,
      profit: 2308,
      lose: null,
      brokerage: 0,
    },
    {
      date: '21/02/2024',
      totalTrades: 24,
      market: 'Bank Nifty',
      investment: 3773,
      isProfitable: false,
      profit: null,
      lose: 3860,
      brokerage: 0,
    },
    {
      date: '22/02/2024',
      totalTrades: 24,
      market: 'Nifty',
      investment: 2000,
      isProfitable: true,
      profit: 128,
      lose: null,
      brokerage: 15,
    },
    {
      date: '23/02/2024',
      totalTrades: 24,
      market: 'Fin Nifty',
      investment: 2128,
      isProfitable: true,
      profit: 2051,
      lose: null,
      brokerage: 33,
    },
    {
      date: '26/02/2024',
      totalTrades: 24,
      market: 'Fin Nifty',
      investment: 2679,
      isProfitable: true,
      profit: 1062,
      lose: null,
      brokerage: 73,
    },
    {
      date: '27/02/2024',
      totalTrades: 24,
      market: 'Fin Nifty',
      investment: 3168,
      isProfitable: true,
      profit: 1424,
      lose: null,
      brokerage: 76,
    },
    {
      date: '28/02/2024',
      totalTrades: 14,
      market: 'Fin Nifty',
      investment: 4017,
      isProfitable: true,
      profit: 717,
      lose: null,
      brokerage: 73,
    },
  ];

  constructor() { }
}
