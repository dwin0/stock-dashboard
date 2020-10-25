import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { StoreService } from 'src/app/core/services/store.service';
import { SavedSelectedStock } from 'src/app/shared/models/saved-selected-stock.model';

@Component({
  selector: 'app-selected-stocks',
  templateUrl: './selected-stocks.component.html',
})
export class SelectedStocksComponent implements OnInit {
  public selectedStocks$: Observable<SavedSelectedStock[]>;

  constructor(private store: StoreService) {}

  ngOnInit(): void {
    this.selectedStocks$ = this.store.getSelectedStocks$();
  }

  removeStock(stock: SavedSelectedStock): void {
    this.store.deleteSelectedStock(stock);
  }
}
