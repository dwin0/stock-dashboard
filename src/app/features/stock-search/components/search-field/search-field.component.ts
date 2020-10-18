import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { StoreService } from 'src/app/core/services/store.service';
import { StockInformation } from '../../../../shared/models/stock-information.model';

import { StockSearchService } from '../../services/stock-search.service';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
})
export class SearchFieldComponent implements OnInit, OnDestroy {
  public stockSearchResults$: Observable<StockInformation[]>;
  public searchTermControl = new FormControl('', Validators.required);
  private searchTermSubscription: Subscription;

  constructor(private stockSearch: StockSearchService, private store: StoreService) {}

  ngOnInit(): void {
    this.searchTermSubscription = this.searchTermControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((searchTerm) => this.handleChanges(searchTerm));
  }

  public handleChanges(searchTerm: string): void {
    this.stockSearchResults$ = this.stockSearch.search(searchTerm);
  }

  ngOnDestroy(): void {
    this.searchTermSubscription.unsubscribe();
  }

  public handleStockClick(stock: StockInformation): void {
    this.store.addSelectedStock(stock);
  }
}
