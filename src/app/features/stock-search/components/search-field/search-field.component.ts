import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { distinctUntilChanged, debounceTime, map } from 'rxjs/operators';
import { StoreService } from 'src/app/core/services/store.service';
import { Stock } from '../../../../shared/models/stock.model';
import { StockSearchService } from '../../services/stock-search.service';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
})
export class SearchFieldComponent implements OnInit, OnDestroy {
  public searchTermControl = new FormControl('', Validators.required);
  public filteredStockSearchResults$: Observable<Stock[]>;

  private searchTermSubscription: Subscription;

  constructor(private stockSearch: StockSearchService, private store: StoreService) {}

  ngOnInit(): void {
    this.searchTermSubscription = this.searchTermControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((searchTerm) => this.performSearch(searchTerm));

    const stockSearchResults$ = this.stockSearch.getSearchResults();
    const selectedStocks$ = this.store.getSelectedStocks();

    this.filteredStockSearchResults$ = combineLatest([stockSearchResults$, selectedStocks$]).pipe(
      map(([stockSearchResults, selectedStocks]) => {
        const selectedStocksSymbols = selectedStocks.map((stock) => stock.symbol);
        return stockSearchResults.filter((result) => !selectedStocksSymbols.includes(result.symbol));
      })
    );
  }

  public performSearch(searchTerm: string): void {
    this.stockSearch.search(searchTerm);
  }

  ngOnDestroy(): void {
    this.searchTermSubscription.unsubscribe();
  }

  public selectStock(stock: Stock): void {
    this.store.addSelectedStock(stock);
  }
}
