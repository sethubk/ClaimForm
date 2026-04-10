import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToastMessage } from '../Models/claimmodels';
import { ToasterService } from '../../Services/toaster.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {

 toast: ToastMessage | null = null;

  constructor(private toastService: ToasterService) {
    this.toastService.toast$.subscribe(t => {
      this.toast = t;
    });
  }
}
