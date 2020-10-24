import { StockPurchase } from './stock-purchase';
import { Stock } from './stock.model';

export interface SelectedStock extends Stock {
  purchases?: StockPurchase[];
}
