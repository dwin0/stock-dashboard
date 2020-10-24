import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { StoreService } from 'src/app/core/services/store.service';
import { SavedSelectedStock } from 'src/app/shared/models/saved-selected-stock.model';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.sass'],
})
export class StockListComponent implements OnInit {
  public selectedStocks$: Observable<SavedSelectedStock[]>;
  public stockToAddPurchase: SavedSelectedStock;
  public stockPurchaseDetailsForm: FormGroup;

  constructor(private store: StoreService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.stockPurchaseDetailsForm = this.fb.group({
      buyDate: [null, Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
    });

    this.selectedStocks$ = this.store.getSelectedStocks();
  }

  public saveStockPurchase(): void {
    if (this.stockPurchaseDetailsForm.invalid) {
      console.error(this.stockPurchaseDetailsForm.errors); // TODO:
      return;
    }

    this.store.addStockPurchase(this.stockToAddPurchase, this.stockPurchaseDetailsForm.value);

    this.unselectStockToAddPurchase();
    this.stockPurchaseDetailsForm.reset();
  }

  addStockPurchase(stock: SavedSelectedStock): void {
    this.stockToAddPurchase = stock;
  }

  public unselectStockToAddPurchase(): void {
    this.stockToAddPurchase = null;
  }
}
