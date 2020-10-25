import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { StockChartComponent } from './components/stock-chart/stock-chart.component';
import { StockChartPageComponent } from './pages/stock-chart-page/stock-chart-page.component';
import { StockChartRoutingModule } from './stock-chart-routing.module';

@NgModule({
  declarations: [StockChartPageComponent, StockChartComponent],
  imports: [SharedModule, StockChartRoutingModule],
  providers: [],
})
export class StockChartModule {}
