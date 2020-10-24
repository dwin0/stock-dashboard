import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'search',
    loadChildren: () => import('./features/stock-search/stock-search.module').then((m) => m.StockSearchModule),
  },
  {
    path: 'list',
    loadChildren: () => import('./features/stock-list/stock-list.module').then((m) => m.StockListModule),
  },
  {
    path: '',
    redirectTo: '/search',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
