import { NgModule } from '@angular/core';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { StockSearchRoutingModule } from './stock-search-routing.module';

@NgModule({
  declarations: [SearchPageComponent],
  imports: [StockSearchRoutingModule],
  providers: [],
})
export class StockSearchModule {}
