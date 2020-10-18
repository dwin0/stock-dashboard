import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { distinctUntilChanged, debounceTime, map } from 'rxjs/operators';
import { StoreService } from 'src/app/core/services/store.service';
import { StockInformation } from '../../../../shared/models/stock-information.model';

import { StockSearchService } from '../../services/stock-search.service';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
})
export class SearchFieldComponent implements OnInit, OnDestroy {
  public searchTermControl = new FormControl('', Validators.required);
  public filteredStockSearchResults$: Observable<StockInformation[]>;
  public selectedStocks$: Observable<StockInformation[]>;

  private searchTermSubscription: Subscription;

  constructor(private stockSearch: StockSearchService, private store: StoreService) {}

  ngOnInit(): void {
    this.searchTermSubscription = this.searchTermControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((searchTerm) => this.handleChanges(searchTerm));

    const stockSearchResults$ = this.stockSearch.getSearchResults();
    this.selectedStocks$ = this.store.getSelectedStocks();

    this.filteredStockSearchResults$ = combineLatest([stockSearchResults$, this.selectedStocks$]).pipe(
      map(([stockSearchResults, selectedStocks]) =>
        stockSearchResults.filter((result) => !selectedStocks.includes(result))
      )
    );
  }

  public handleChanges(searchTerm: string): void {
    this.stockSearch.search(searchTerm);
  }

  ngOnDestroy(): void {
    this.searchTermSubscription.unsubscribe();
  }

  public handleStockClick(stock: StockInformation): void {
    this.store.addSelectedStock(stock);
  }
}
