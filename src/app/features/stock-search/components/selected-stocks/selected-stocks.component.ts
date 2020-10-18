import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { StoreService } from 'src/app/core/services/store.service';
import { StockInformation } from 'src/app/shared/models/stock-information.model';

@Component({
  selector: 'app-selected-stocks',
  templateUrl: './selected-stocks.component.html',
})
export class SelectedStocksComponent implements OnInit {
  public selectedStocks$: Observable<StockInformation[]>;

  constructor(private store: StoreService) {}

  ngOnInit(): void {
    this.selectedStocks$ = this.store.getSelectedStocks();
  }
}
