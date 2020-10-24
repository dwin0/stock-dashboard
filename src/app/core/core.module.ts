import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationComponent } from './components/navigation/navigation.component';

@NgModule({
  declarations: [NavigationComponent],
  imports: [RouterModule],
  exports: [NavigationComponent],
  providers: [],
})
export class CoreModule {}
