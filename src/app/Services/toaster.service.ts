import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ToastMessage, ToastType } from '../Components/Models/claimmodels';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  
  
private toastSubject = new BehaviorSubject<ToastMessage | null>(null);
  toast$ = this.toastSubject.asObservable();

  show(type: ToastType, message: string): void {
    this.toastSubject.next({ type, message });

    // Auto hide after 3 seconds
    setTimeout(() => {
      this.toastSubject.next(null);
    }, 3000);
  }

  success(message: string): void {
    this.show('success', message);
  }

  error(message: string): void {
    this.show('error', message);
  }

  warning(message: string): void {
    this.show('warning', message);
  }

  info(message: string): void {
    this.show('info', message);
  }
    imageUrl: string | null = null;
  isOpen: boolean = false;
  billopen: boolean = false;
data:any[]=   [];
 open(image: string) {
    this.imageUrl = image;
    this.isOpen = true;
     
  }
  
   bilopen(image: string) {
    this.imageUrl = image;
    this.billopen = true;
     
  }

  close() {
    this.isOpen = false;
    this.billopen = false;
    this.imageUrl = null;
      this.data = [];
  }
}
