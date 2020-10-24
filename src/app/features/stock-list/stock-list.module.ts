import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { StockListComponent } from './components/stock-list/stock-list.component';
import { StockListPageComponent } from './pages/stock-list-page/stock-list-page.component';
import { StockListRoutingModule } from './stock-list-routing.module';

@NgModule({
  declarations: [StockListPageComponent, StockListComponent],
  imports: [SharedModule, StockListRoutingModule],
  providers: [],
})
export class StockListModule {}
