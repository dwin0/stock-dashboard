import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StockSearchService {
  public search(searchTerm: string): string {
    return searchTerm;
  }
}
