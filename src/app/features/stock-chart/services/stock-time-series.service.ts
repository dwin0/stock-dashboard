import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SavedSelectedStock } from 'src/app/shared/models/saved-selected-stock.model';
import { AlphVantageService } from 'src/app/shared/services/alpha-vantage.service';

@Injectable({
  providedIn: 'root',
})
export class StockTimeSeriesService extends AlphVantageService {
  private TIME_SERIES_URL = `${this.BASE_URL}function=TIME_SERIES_DAILY_ADJUSTED`;

  constructor(private http: HttpClient) {
    super();
  }

  public getTimeSeries(stock: SavedSelectedStock): void {
    this.http
      .get(`${this.TIME_SERIES_URL}&symbol=${stock.symbol}&apikey=${this.API_KEY}`)
      .subscribe((a) => console.log(a));
  }
}
