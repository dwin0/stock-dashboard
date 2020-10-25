import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { StoreService } from 'src/app/core/services/store.service';
import { StockTimeSeriesService } from '../../services/stock-time-series.service';

@Component({
  selector: 'app-stock-chart',
  templateUrl: './stock-chart.component.html',
})
export class StockChartComponent implements OnInit {
  constructor(private stockTimeSeries: StockTimeSeriesService, private store: StoreService) {}

  public ngOnInit(): void {
    const timeSeries$ = this.store
      .getSelectedStocks$()
      .pipe(switchMap((stocks) => this.stockTimeSeries.getTimeSeries(stocks)))
      .subscribe(console.log);
  }
}
