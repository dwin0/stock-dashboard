import { NgModule } from '@angular/core';
import { StockListPageComponent } from './pages/stock-list-page/stock-list-page.component';
import { StockListRoutingModule } from './stock-list-routing.module';

@NgModule({
  declarations: [StockListPageComponent],
  imports: [StockListRoutingModule],
  providers: [],
})
export class StockListModule {}
