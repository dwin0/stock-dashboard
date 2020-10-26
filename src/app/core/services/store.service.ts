import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, share, tap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { SelectedStock } from 'src/app/shared/models/selected-stock.model';
import { SavedSelectedStock } from 'src/app/shared/models/saved-selected-stock.model';
import { StockPurchase } from 'src/app/shared/models/stock-purchase';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private firebaseStocks: AngularFirestoreCollection<SelectedStock>;
  private selectedStocks$: Observable<SavedSelectedStock[]>;

  constructor(fireStore: AngularFirestore) {
    this.firebaseStocks = fireStore.collection<SelectedStock>('stocks');
    this.selectedStocks$ = this.firebaseStocks.snapshotChanges().pipe(
      map((changes) => changes.map((c) => ({ id: c.payload.doc.id, ...c.payload.doc.data() }))),
      tap(console.log)
    );
  }

  public getSelectedStocks$(): Observable<SavedSelectedStock[]> {
    return this.selectedStocks$;
  }

  public addSelectedStock(stock: SelectedStock): void {
    this.firebaseStocks.add(stock).catch((error) => console.error(error));
  }

  public deleteSelectedStock(stock: SavedSelectedStock): void {
    this.firebaseStocks
      .doc(stock.id)
      .delete()
      .catch((error) => console.error(error));
  }

  // TODO: add purchase id
  public addStockPurchase(stock: SavedSelectedStock, stockPurchase: StockPurchase): void {
    this.firebaseStocks.doc(stock.id).update({
      purchases: [...(stock.purchases || []), stockPurchase],
    });
  }

  public removeStockPurchase(stock: SavedSelectedStock, stockPurchase: StockPurchase): void {
    this.firebaseStocks.doc(stock.id).update({
      purchases: stock.purchases.filter((purchase) => purchase.buyDate !== stockPurchase.buyDate),
    });
  }
}
