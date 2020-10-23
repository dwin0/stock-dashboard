import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, share, tap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Stock } from 'src/app/shared/models/stock.model';
import { SelectedStock } from 'src/app/features/stock-search/models/selected-stock.model';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private firebaseStocks: AngularFirestoreCollection<Stock>;
  private selectedStocks$: Observable<SelectedStock[]>;

  constructor(fireStore: AngularFirestore) {
    this.firebaseStocks = fireStore.collection<Stock>('stocks');
    this.selectedStocks$ = this.firebaseStocks.snapshotChanges().pipe(
      map((changes) => changes.map((c) => ({ id: c.payload.doc.id, ...c.payload.doc.data() }))),
      tap(console.log),
      share()
    );
  }

  public getSelectedStocks(): Observable<SelectedStock[]> {
    return this.selectedStocks$;
  }

  public addSelectedStock(stock: Stock): void {
    this.firebaseStocks.add(stock).catch((error) => console.error(error));
  }

  public deleteSelectedStock(stock: SelectedStock): void {
    this.firebaseStocks
      .doc(stock.id)
      .delete()
      .catch((error) => console.error(error));
  }
}
