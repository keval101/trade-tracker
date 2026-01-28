import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NseDataService {

  // In development we hit Angular dev proxy (proxy.conf.json)
  // In production on Vercel we hit our serverless function via vercel.json rewrite
  private readonly baseURL = environment.nseBaseUrl;

  constructor(private http: HttpClient) { }

  searchCompany(query: string) {
    if (environment.production) {
      // On Vercel: /nse-api/search-company -> vercel.json -> /api/nse-search
      return this.http.get(
        `${this.baseURL}/search-company?q=${encodeURIComponent(query)}`
      );
    }
    // Development: Angular proxy direct to NSE search
    return this.http.get(
      `${this.baseURL}/search/autocomplete?q=${encodeURIComponent(query)}`
    );
  }

  marketData() {
    if (environment.production) {
      // On Vercel: /nse-api/market-data -> vercel.json -> /api/nse-index
      return this.http.get(`${this.baseURL}/market-data`);
    }
    // Development: Angular proxy to NSE
    return this.http.get(
      `${this.baseURL}/apiClient?functionName=getIndexData&&type=All`
    );
  }
}

