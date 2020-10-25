import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { SavedSelectedStock } from 'src/app/shared/models/saved-selected-stock.model';
import { AlphVantageService } from 'src/app/shared/services/alpha-vantage.service';
import { StockTimeSeriesResult } from '../models/stock-time-series-result.model';

@Injectable({
  providedIn: 'root',
})
export class StockTimeSeriesService extends AlphVantageService {
  private TIME_SERIES_URL = `${this.BASE_URL}function=TIME_SERIES_DAILY_ADJUSTED`;

  constructor(private http: HttpClient) {
    super();
  }

  public getTimeSeries(stocks: SavedSelectedStock[]): Observable<StockTimeSeriesResult[]> {
    const apiCalls = stocks
      .map((stock) => stock.symbol)
      .map((symbol) =>
        this.http.get<StockTimeSeriesResult>(`${this.TIME_SERIES_URL}&symbol=${symbol}&apikey=${this.API_KEY}`)
      );

    return forkJoin(apiCalls);
  }
}
