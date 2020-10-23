import { Stock } from 'src/app/shared/models/stock.model';

export interface SelectedStock extends Stock {
  id: string;
}
