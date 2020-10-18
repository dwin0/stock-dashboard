import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { StockSearchService } from '../services/stock-search.service';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
})
export class SearchFieldComponent implements OnInit, OnDestroy {
  protected searchTermControl = new FormControl('', Validators.required);
  private searchTermSubscription: Subscription;

  constructor(private stockSearch: StockSearchService) {}

  ngOnInit(): void {
    this.searchTermSubscription = this.searchTermControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => this.handleChanges(searchTerm));
  }

  public handleChanges(searchTerm: string): void {
    const result = this.stockSearch.search(searchTerm);
    console.log(result);
  }

  ngOnDestroy(): void {
    this.searchTermSubscription.unsubscribe();
  }
}
