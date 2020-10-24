import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { distinctUntilChanged, debounceTime, map } from 'rxjs/operators';
import { StoreService } from 'src/app/core/services/store.service';
import { Stock } from '../../../../shared/models/stock.model';
import { SelectedStock } from '../../models/selected-stock.model';
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

  constructor(private stockSearch: StockSearchService, private store: StoreService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.setupForms();
    this.setupSearchResults();
  }

  private setupForms(): void {
    this.searchTermControl = this.fb.control('', Validators.required);
    this.currentSelectedStockDetails = this.fb.group({
      buyDate: [null, Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  private setupSearchResults(): void {
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

  public selectStock(stock: Stock): void {
    this.currentSelectedStock = stock;
  }

  public unselectStock(): void {
    this.currentSelectedStock = null;
  }

  public saveSelectedStock(): void {
    const stock: SelectedStock = {
      ...this.currentSelectedStock,
      ...this.currentSelectedStockDetails.value,
    };

    this.store.addSelectedStock(stock);

    this.unselectStock();
    this.currentSelectedStockDetails.reset();
  }

  ngOnDestroy(): void {
    this.searchTermSubscription.unsubscribe();
  }
}
