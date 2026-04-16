import { Component } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { ToasterService } from '../../Services/toaster.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-bill-preview',
  standalone: true,
  imports: [ClarityModule,CommonModule],
  templateUrl: './bill-preview.component.html',
  styleUrl: './bill-preview.component.css'
})
export class BillPreviewComponent {
 imageUrl: string | null = null;
  isOpen: boolean = false;
  
safeImageUrl: SafeUrl | null = null;
constructor(
  public modalService: ToasterService,
  private sanitizer: DomSanitizer
) {}

ngOnChanges() {
  if (this.modalService.imageUrl) {
    this.safeImageUrl = this.sanitizer.bypassSecurityTrustUrl(
      this.modalService.imageUrl
    );
  }
}

downloadImage() {
  const url = this.modalService.imageUrl;

  if (!url) return;

  const link = document.createElement('a');
  link.href = url;

  // Optional: custom file name
  link.download = 'Expense_Bill.png';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}}
