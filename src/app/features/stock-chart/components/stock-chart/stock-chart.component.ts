import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { Observable, Subscription } from 'rxjs';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
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
  private timeSeries$: Observable<{ [key: string]: number }[]>;

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
      switchMap((stocks) => this.stockTimeSeries.getTimeSeries(stocks)),
      map((stockTimeSeriesResults) =>
        stockTimeSeriesResults.map((stockTimeSeriesResult) => this.transformTimeSeriesResult(stockTimeSeriesResult))
      ),
      map((datesAndCloseValueAllStocks) =>
        datesAndCloseValueAllStocks.map((datesAndCloseValueSingleStock) =>
          this.getProfitsPerDay(datesAndCloseValueSingleStock)
        )
      ),
      withLatestFrom(this.selectedStocksInDepot$),
      map((profitsAndStockInformation) => this.combineProfitsAndStockInformation(profitsAndStockInformation)),
      map((profitsAndStockInformationAllStocks) =>
        profitsAndStockInformationAllStocks.map((profitsAndStockInformationSingleStock) =>
          this.calculateEarningsPerDay(profitsAndStockInformationSingleStock)
        )
      )
    );

    this.lineChartDataSubscription = this.timeSeries$
      .pipe(
        map((dateAndEarningsPerStockAndDay) => {
          // dates are the same for all stocks
          const tradingDates = Object.keys(dateAndEarningsPerStockAndDay[0]);

          const earningsPerDay = dateAndEarningsPerStockAndDay.reduce(
            (acc: number[], dateAndEarningsSingleStockPerDay) => {
              return Object.values(dateAndEarningsSingleStockPerDay).map(
                (earningPerDay, currentDayIndex) => acc[currentDayIndex] + earningPerDay
              );
            },
            Array(tradingDates.length).fill(0)
          );

          return {
            tradingDates,
            earningsPerDay,
          };
        })
      )
      .subscribe(({ tradingDates, earningsPerDay }) => {
        this.lineChartData = [
          {
            data: earningsPerDay,
            label: 'Earnings',
          },
        ];

        this.lineChartLabels = tradingDates;
      });
  }

  private transformTimeSeriesResult(
    stockTimeSeriesResult: StockTimeSeriesResult
  ): { date: string; closeValue: number }[] {
    return Object.entries(stockTimeSeriesResult['Time Series (Daily)'])
      .map(([date, stockValuesForDate]) => ({
        date,
        closeValue: Number(stockValuesForDate['4. close']),
      }))
      .reverse(); // dates from API arrive newest to oldest day
  }

  private getProfitsPerDay(
    datesAndCloseValueSingleStock: { date: string; closeValue: number }[]
  ): { date: string; closeValue: number; diff: number | null }[] {
    return datesAndCloseValueSingleStock.map(({ date, closeValue: todaysCloseValue }, index) => {
      const hasPreviousDayData = index !== 0;

      const diffToPreviousDay = hasPreviousDayData
        ? todaysCloseValue - datesAndCloseValueSingleStock[index - 1].closeValue
        : null;

      return {
        date,
        closeValue: todaysCloseValue,
        diff: diffToPreviousDay,
      };
    });
  }

  private combineProfitsAndStockInformation([profitsPerStockAndDay, selectedStocks]: [
    { date: string; closeValue: number; diff: number | null }[][],
    SavedSelectedStock[]
  ]): {
    stock: SavedSelectedStock;
    profitsPerDay: { date: string; closeValue: number; diff: number | null }[];
  }[] {
    return selectedStocks.map((stock, index) => ({
      stock,
      profitsPerDay: profitsPerStockAndDay[index],
    }));
  }

  private calculateEarningsPerDay({
    stock,
    profitsPerDay,
  }: {
    stock: SavedSelectedStock;
    profitsPerDay: { date: string; closeValue: number; diff: number | null }[];
  }): { [key: string]: number } {
    return profitsPerDay.reduce((acc, { date, closeValue, diff }, index) => {
      if (index === 0) {
        // not possible to calculate values for first day (no closing value of previous day)
        return {
          [date]: 0,
        };
      }

      const timeSeriesDate = new Date(date).getTime();

      const earnings = stock.purchases.reduce((sum, purchase) => {
        const purchaseDate = new Date(purchase.buyDate).getTime();

        if (timeSeriesDate < purchaseDate) {
          // stock purchase is in future
          return sum;
        }

        if (purchaseDate === timeSeriesDate) {
          const diffOfBuyDate = closeValue - purchase.price;
          return sum + purchase.amount * diffOfBuyDate;
        }

        return sum + purchase.amount * diff;
      }, 0);

      return {
        ...acc,
        [date]: earnings,
      };
    }, {});
  }

  ngOnDestroy(): void {
    this.lineChartDataSubscription.unsubscribe();
  }
}
