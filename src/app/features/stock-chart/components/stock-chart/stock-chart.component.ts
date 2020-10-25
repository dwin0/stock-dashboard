import { Component, OnInit } from '@angular/core';
import { switchMap, map } from 'rxjs/operators';
import { StoreService } from 'src/app/core/services/store.service';
import { StockTimeSeriesService } from '../../services/stock-time-series.service';

@Component({
  selector: 'app-stock-chart',
  templateUrl: './stock-chart.component.html',
})
export class StockChartComponent implements OnInit {
  constructor(private stockTimeSeries: StockTimeSeriesService, private store: StoreService) {}

  public ngOnInit(): void {
    this.store
      .getSelectedStocks$()
      .pipe(
        switchMap((stocks) => this.stockTimeSeries.getTimeSeries(stocks)),
        map((timeSeries) =>
          timeSeries.reduce((acc, ts) => {
            const symbol = ts['Meta Data']['2. Symbol'];

            const closingPrices = Object.entries(ts['Time Series (Daily)'])
              .map(([date, values]) => ({
                [date]: values['4. close'],
              }))
              .reverse();

            return {
              ...acc,
              [symbol]: closingPrices,
            };
          }, {})
        )
      )
      .subscribe(console.log);
  }
}
