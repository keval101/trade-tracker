import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NseDataService {

  // Use proxy path for development, will be proxied to https://www.nseindia.com/api
  baseURL = '/nse-api/NextApi'
  constructor(private http: HttpClient) { }

  searchCompany(query: string) {
    return this.http.get(`${this.baseURL}/search/autocomplete?q=${query}`);
  }

  marketData() {
    // https://www.nseindia.com/api/NextApi/apiClient?functionName=getIndexData&&type=All
    return this.http.get(`${this.baseURL}/apiClient?functionName=getIndexData&&type=All`);
  }
}
