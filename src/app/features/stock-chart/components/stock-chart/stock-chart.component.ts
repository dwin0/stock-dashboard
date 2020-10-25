import { Component, OnInit } from '@angular/core';
import { StockTimeSeriesService } from '../../services/stock-time-series.service';

@Component({
  selector: 'app-stock-chart',
  templateUrl: './stock-chart.component.html',
})
export class StockChartComponent implements OnInit {
  private fakeStock = {
    id: '1TgUEus9LvmTASmJQ13c',
    name: 'Apple Inc.',
    purchases: [],
    symbol: 'AAPL',
  };

  constructor(private stockTimeSeries: StockTimeSeriesService) {}

  public ngOnInit(): void {
    this.stockTimeSeries.getTimeSeries(this.fakeStock);
  }
}
