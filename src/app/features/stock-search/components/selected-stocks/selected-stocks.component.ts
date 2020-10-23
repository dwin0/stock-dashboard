import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { StoreService } from 'src/app/core/services/store.service';
import { SelectedStock } from '../../models/selected-stock.model';

@Component({
  selector: 'app-selected-stocks',
  templateUrl: './selected-stocks.component.html',
})
export class SelectedStocksComponent implements OnInit {
  public selectedStocks$: Observable<SelectedStock[]>;

  constructor(private store: StoreService) {}

  ngOnInit(): void {
    this.selectedStocks$ = this.store.getSelectedStocks();
  }

  removeStock(stock: SelectedStock): void {
    this.store.deleteSelectedStock(stock);
  }
}
