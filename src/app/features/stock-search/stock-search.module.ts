import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchFieldComponent } from './components/search-field.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { StockSearchRoutingModule } from './stock-search-routing.module';

@NgModule({
  declarations: [SearchPageComponent, SearchFieldComponent],
  imports: [ReactiveFormsModule, StockSearchRoutingModule],
  providers: [],
})
export class StockSearchModule {}
