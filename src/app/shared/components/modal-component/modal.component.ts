import { Component, ElementRef, Input, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.sass'],
})
export class ModalComponent {
  @Input()
  public isVisible: boolean;

  @ViewChild('modalBox') modalBox: ElementRef;

  @Input()
  public title: string;

  @Input()
  public content: TemplateRef<any>;

  public closeModalOutsideClick(event: MouseEvent): void {
    const isClickInsideModalBox = this.modalBox.nativeElement.contains(event.target);

    if (!isClickInsideModalBox) {
      this.closeModal();
    }
  }

  public closeModal(): void {
    this.isVisible = false;
  }
}
