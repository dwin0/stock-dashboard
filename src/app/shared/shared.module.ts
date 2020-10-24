import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ModalComponent } from './components/modal-component/modal.component';

@NgModule({
  declarations: [ModalComponent],
  imports: [CommonModule],
  exports: [CommonModule, HttpClientModule, ModalComponent],
  providers: [],
})
export class SharedModule {}
