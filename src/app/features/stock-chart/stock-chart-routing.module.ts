import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockChartPageComponent } from './pages/stock-chart-page/stock-chart-page.component';

const routes: Routes = [
  {
    path: '',
    component: StockChartPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockChartRoutingModule {}
