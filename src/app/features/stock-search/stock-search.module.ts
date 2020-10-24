import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

import { SearchFieldComponent } from './components/search-field/search-field.component';
import { SelectedStocksComponent } from './components/selected-stocks/selected-stocks.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { StockSearchRoutingModule } from './stock-search-routing.module';

@NgModule({
  declarations: [SearchPageComponent, SearchFieldComponent, SelectedStocksComponent],
  imports: [SharedModule, ReactiveFormsModule, StockSearchRoutingModule],
  providers: [],
})
export class StockSearchModule {}
