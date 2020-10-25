import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { AlphVantageService } from 'src/app/shared/services/alpha-vantage.service';
import { Stock } from '../../../shared/models/stock.model';
import { StockSearchResult } from '../models/stock-search-result.model';

@Injectable({
  providedIn: 'root',
})
export class StockSearchService extends AlphVantageService {
  private QUERY_URL = `${this.BASE_URL}function=SYMBOL_SEARCH`;

  private searchResults$: BehaviorSubject<Stock[]>;

  constructor(private http: HttpClient) {
    super();
    this.searchResults$ = new BehaviorSubject([]);
  }

  public getSearchResults(): BehaviorSubject<Stock[]> {
    return this.searchResults$;
  }

  public search(searchTerm: string): void {
    this.http
      .get<StockSearchResult>(`${this.QUERY_URL}&keywords=${searchTerm}&apikey=${this.API_KEY}`)
      .pipe(
        map((result) =>
          (result.bestMatches || []).map((match) => ({
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
