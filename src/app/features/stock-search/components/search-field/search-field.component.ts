import { Component, OnDestroy, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
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
  public searchTermControl: FormControl;
  public filteredStockSearchResults$: Observable<Stock[]>;
  public currentSelectedStock: Stock;
  public currentSelectedStockDetails: FormGroup;

  private searchTermSubscription: Subscription;

  constructor(private stockSearch: StockSearchService, private store: StoreService) {}

  ngOnInit(): void {
    this.searchTermControl = new FormControl('', Validators.required);
    this.currentSelectedStockDetails = new FormGroup({
      buyDate: new FormControl(null, Validators.required),
      amount: new FormControl(0, [Validators.required, Validators.min(0)]),
      price: new FormControl(0, [Validators.required, Validators.min(0)]),
    });

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
    this.currentSelectedStock = stock;
  }

  public unselectStock(): void {
    this.currentSelectedStock = null;
  }

  public saveSelectedStock(): void {
    console.log(this.currentSelectedStockDetails.value);

    // this.store.addSelectedStock(stock);

    // this.currentSelectedStockDetails.reset();
  }
}
