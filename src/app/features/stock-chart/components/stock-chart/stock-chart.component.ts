import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { Observable, Subscription } from 'rxjs';
import { switchMap, map, withLatestFrom, tap } from 'rxjs/operators';
import { StoreService } from 'src/app/core/services/store.service';
import { SavedSelectedStock } from 'src/app/shared/models/saved-selected-stock.model';
import { StockTimeSeriesResult } from '../../models/stock-time-series-result.model';
import { StockTimeSeriesService } from '../../services/stock-time-series.service';

@Component({
  selector: 'app-stock-chart',
  templateUrl: './stock-chart.component.html',
})
export class StockChartComponent implements OnInit, OnDestroy {
  private lineChartDataSubscription: Subscription;
  private selectedStocksInDepot$: Observable<SavedSelectedStock[]>;
  private timeSeries$: Observable<StockTimeSeriesResult[]>;

  public lineChartData: ChartDataSets[];
  public lineChartLabels: Label[];

  public readonly lineChartOptions = {
    responsive: true,
  };

  constructor(private stockTimeSeries: StockTimeSeriesService, private store: StoreService) {}

  public ngOnInit(): void {
    this.selectedStocksInDepot$ = this.store
      .getSelectedStocks$()
      .pipe(map((selectedStocks) => selectedStocks.filter((stock) => stock.purchases?.length)));

    this.timeSeries$ = this.selectedStocksInDepot$.pipe(
      switchMap((stocks) => this.stockTimeSeries.getTimeSeries(stocks))
    );

    const profitAndClosePerStockAndDayLast100Days: Observable<
      { [key: string]: { diff: number | null; close: number } }[]
    > = this.timeSeries$.pipe(
      map((timeSeries) =>
        timeSeries.map((timeSeriesforSingleStock) => {
          const ts = Object.entries(timeSeriesforSingleStock['Time Series (Daily)']).reverse();

          return ts.reduce((acc, [date, stockValuesForDate], index) => {
            const currentDayClose = Number(stockValuesForDate['4. close']);

            if (index === 0) {
              return {
                [date]: {
                  diff: null,
                  close: currentDayClose,
                },
              };
            }

            const previousDayClose = Number(ts[index - 1][1]['4. close']);

            return {
              ...acc,
              [date]: {
                diff: currentDayClose - previousDayClose,
                close: currentDayClose,
              },
            };
          }, {});
        })
      )
    );

    const earningsPerStockLast100Days: Observable<
      { [key: string]: number }[]
    > = profitAndClosePerStockAndDayLast100Days.pipe(
      withLatestFrom(this.selectedStocksInDepot$),
      map(([profitAndClosePerStockLast100Days, stocks]) =>
        profitAndClosePerStockLast100Days.map((profitAndCloseForSingleStockLast100Days, index) => {
          const stock = stocks[index];
          return Object.entries(profitAndCloseForSingleStockLast100Days).reduce(
            (acc, [date, profitAndCloseOnDate], index) => {
              const timeSeriesDate = new Date(date);

              const profitForStock = stock.purchases.reduce((sum, purchase) => {
                const purchaseDate = new Date(purchase.buyDate);

                if (purchaseDate.getTime() > timeSeriesDate.getTime()) {
                  return sum;
                }

                if (purchaseDate.getTime() === timeSeriesDate.getTime()) {
                  return sum + purchase.amount * (profitAndCloseOnDate.close - purchase.price);
                }

                if (index === 0) {
                  // not possible to calculate values for first day (no closing day of previous day)
                  return sum;
                }

                return sum + purchase.amount * profitAndCloseOnDate.diff;
              }, 0);

              return {
                ...acc,
                [date]: profitForStock,
              };
            },
            {}
          );
        })
      )
    );

    this.lineChartDataSubscription = earningsPerStockLast100Days
      .pipe(
        map((earningsPerStockAndDay) => {
          const tradingDates = Object.keys(earningsPerStockAndDay[0]);
          const earningsPerDay = earningsPerStockAndDay.reduce((acc: number[], earnings, index) => {
            if (index === 0) {
              return Object.values(earnings);
            }

            return Object.values(earnings).map((e, i) => acc[i] + e);
          }, []);

          return {
            tradingDates,
            earningsPerDay,
          };
        }),
        tap(console.log)
      )
      .subscribe((earningsData: { tradingDates: string[]; earningsPerDay: number[] }) => {
        this.lineChartData = [
          {
            data: earningsData.earningsPerDay,
            label: 'Earnings',
          },
        ];

        this.lineChartLabels = earningsData.tradingDates;
      });
  }

  ngOnDestroy(): void {
    this.lineChartDataSubscription.unsubscribe();
  }
}
