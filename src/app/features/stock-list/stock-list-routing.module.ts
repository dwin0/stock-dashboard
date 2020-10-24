import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockListPageComponent } from './pages/stock-list-page/stock-list-page.component';

const routes: Routes = [
  {
    path: '',
    component: StockListPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockListRoutingModule {}
