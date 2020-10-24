import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, share, tap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { SelectedStock } from 'src/app/features/stock-search/models/selected-stock.model';
import { SavedSelectedStock } from 'src/app/features/stock-search/models/saved-selected-stock.model';

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
      tap(console.log),
      share()
    );
  }

  public getSelectedStocks(): Observable<SavedSelectedStock[]> {
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
}
