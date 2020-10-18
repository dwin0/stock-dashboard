import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { StockInformation } from 'src/app/shared/models/stock-information.model';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private selectedStocks$: BehaviorSubject<StockInformation[]>;

  constructor() {
    this.selectedStocks$ = new BehaviorSubject([]);
  }

  public getSelectedStocks(): Observable<StockInformation[]> {
    return this.selectedStocks$.asObservable();
  }

  public addSelectedStock(stock: StockInformation): void {
    this.selectedStocks$.pipe(take(1)).subscribe((stocks) => {
      const newlySelectedStocks = [...stocks, stock];
      this.selectedStocks$.next(newlySelectedStocks);
    });
  }
}
