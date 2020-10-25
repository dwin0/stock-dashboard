import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { StoreService } from 'src/app/core/services/store.service';
import { StockTimeSeriesService } from '../../services/stock-time-series.service';

@Component({
  selector: 'app-stock-chart',
  templateUrl: './stock-chart.component.html',
})
export class StockChartComponent implements OnInit, OnDestroy {
  private lineChartDataSubscription: Subscription;

  public lineChartData: ChartDataSets[];
  public lineChartLabels: Label[];

  public readonly lineChartOptions = {
    responsive: true,
  };

  constructor(private stockTimeSeries: StockTimeSeriesService, private store: StoreService) {}

  public ngOnInit(): void {
    this.lineChartDataSubscription = this.store
      .getSelectedStocks$()
      .pipe(
        switchMap((stocks) => this.stockTimeSeries.getTimeSeries(stocks)),
        map((timeSeries) =>
          timeSeries.map((ts) => {
            const symbol = ts['Meta Data']['2. Symbol'];

            const dates = Object.keys(ts['Time Series (Daily)']).reverse();

            const closingPrices = Object.values(ts['Time Series (Daily)'])
              .map((dayValue) => Number(dayValue['4. close']))
              .reverse();

            return {
              symbol,
              dates,
              closingPrices,
            };
          })
        )
      )
      .subscribe((timeSeriesData) => {
        this.lineChartData = timeSeriesData.map((tsData) => ({
          data: tsData.closingPrices,
          label: tsData.symbol,
        }));

        this.lineChartLabels = timeSeriesData[0].dates;
      });
  }

  ngOnDestroy(): void {
    this.lineChartDataSubscription.unsubscribe();
  }
}
