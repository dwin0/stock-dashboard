import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { StoreService } from 'src/app/core/services/store.service';
import { SavedSelectedStock } from 'src/app/shared/models/saved-selected-stock.model';
import { StockPurchase } from 'src/app/shared/models/stock-purchase';
import { PurchaseDetailFormErrors } from '../../models/purchase-detail-form-errors';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.sass'],
})
export class StockListComponent implements OnInit {
  public selectedStocks$: Observable<SavedSelectedStock[]>;
  public stockToAddPurchase: SavedSelectedStock;
  public stockPurchaseDetailsForm: FormGroup;
  public formErrors: PurchaseDetailFormErrors;

  constructor(private store: StoreService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.stockPurchaseDetailsForm = this.fb.group({
      buyDate: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(0)]],
      price: [null, [Validators.required, Validators.min(0)]],
    });

    this.selectedStocks$ = this.store.getSelectedStocks();
  }

  public getTotalNumberOfStocks(stock: SavedSelectedStock): number {
    if (!stock.purchases) {
      return 0;
    }

    return stock.purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
  }

  public getSortedPurchases(stock: SavedSelectedStock): StockPurchase[] {
    if (!stock.purchases) {
      return [];
    }

    return stock.purchases.sort(
      (purchase1, purchase2) => new Date(purchase1.buyDate).getTime() - new Date(purchase2.buyDate).getTime()
    );
  }

  public saveStockPurchase(): void {
    this.formErrors = null;

    if (this.stockPurchaseDetailsForm.valid) {
      this.store.addStockPurchase(this.stockToAddPurchase, this.stockPurchaseDetailsForm.value);

      this.unselectStockToAddPurchase();
      this.stockPurchaseDetailsForm.reset();
      return;
    }

    this.formErrors = this.collectFormErrors();
  }

  private collectFormErrors(): PurchaseDetailFormErrors {
    return Object.keys(this.stockPurchaseDetailsForm.controls).reduce((acc, control) => {
      const errors = this.stockPurchaseDetailsForm.get(control).errors;

      return errors
        ? {
            ...acc,
            [control]: errors,
          }
        : acc;
    }, {});
  }

  public addStockPurchase(stock: SavedSelectedStock): void {
    this.stockToAddPurchase = stock;
  }

  public unselectStockToAddPurchase(): void {
    this.stockToAddPurchase = null;
  }
}
