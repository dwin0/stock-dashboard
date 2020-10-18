import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { StockInformation } from '../../../shared/models/stock-information.model';
import { StockSearchResult } from '../models/stock-search-result.model';

@Injectable({
  providedIn: 'root',
})
export class StockSearchService {
  private QUERY_URL = 'https://www.alphavantage.co/query?function=SYMBOL_SEARCH';
  private API_KEY = environment.API_KEY;

  private searchResults$: BehaviorSubject<StockInformation[]>;

  constructor(private http: HttpClient) {
    this.searchResults$ = new BehaviorSubject([]);
  }

  public getSearchResults(): BehaviorSubject<StockInformation[]> {
    return this.searchResults$;
  }

  public search(searchTerm: string): void {
    this.http
      .get<StockSearchResult>(`${this.QUERY_URL}&keywords=${searchTerm}&apikey=${this.API_KEY}`)
      .pipe(
        map((result) =>
          result.bestMatches.map((match) => ({
            symbol: match['1. symbol'],
            name: match['2. name'],
          }))
        )
      )
      .subscribe((stockSearchResult) => {
        this.searchResults$.next(stockSearchResult);
      });
  }
}
