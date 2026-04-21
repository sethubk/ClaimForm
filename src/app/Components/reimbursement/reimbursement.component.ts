import { Component } from '@angular/core';
import { ClaimWithEmployeeDetails } from '../Models/claimmodels';
import { Router } from '@angular/router';
import { ApiService } from '../../Services/Api Services/api.service';
import { ClaimApiService } from '../../Services/Api Services/claim-api.service';
import { ToasterService } from '../../Services/toaster.service';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reimbursement',
  standalone: true,
  imports: [ClarityModule, CommonModule, FormsModule],
  templateUrl: './reimbursement.component.html',
  styleUrl: './reimbursement.component.css'
})
export class ReimbursementComponent {

  Claims: ClaimWithEmployeeDetails[] = [];
filteredClaims: ClaimWithEmployeeDetails[] = [];
  pendingClaims: ClaimWithEmployeeDetails[] = [];
  approvedClaims: ClaimWithEmployeeDetails[] = [];
  rejectedClaims: ClaimWithEmployeeDetails[] = [];

  searchText: string = '';

  constructor(
    private api: ApiService,
    private toastService: ToasterService,
    private router: Router,
    private ClaimApi: ClaimApiService
  ) {}

  ngOnInit() {
    this.getclaims();
    
  }

  getclaims() {
    this.toastService.showLoader()
    this.ClaimApi.getAllClaims().subscribe({
      next: (res) => {
console.log(res);
        const validClaims = res.filter(
          c => c.status !== 'Draft' && (c.amount ?? 0) > 0
        );

        this.Claims = validClaims;
        this.filteredClaims=validClaims;
  this.toastService.hideLoader()
        this.pendingClaims = validClaims.filter(c => c.status === 'pending');
        this.approvedClaims = validClaims.filter(c => c.status === 'Approved');
        this.rejectedClaims = validClaims.filter(c => c.status === 'Rejected');
      },
      error: () => {
        this.toastService.error("Failed to load claims");
        this.toastService.hideLoader()
      }
    });
  }
  currentStatusFilter: string = 'all';
applyFilter(status: string): void {
  this.currentStatusFilter = status;

  if (status === 'all') {
    this.filteredClaims = [...this.Claims];
  } else {
    this.filteredClaims = this.Claims.filter(
      c => c.status === status
    );
  }
}
  goToClaimView(claimId: string) {
    this.router.navigate(['/reimbursement', claimId]);
  }

 filterClaims(): void {
  if (!this.searchText) {
    this.filteredClaims = [...this.Claims];
    return;
  }

  const text = this.searchText.toLowerCase();

  this.filteredClaims = this.Claims.filter(c =>
    c.empCode?.toLowerCase().includes(text) ||
    c.name?.toLowerCase().includes(text)
  );
}

  // 📊 Counts
  getCount(status: string) {
    return this.Claims.filter(c => c.status === status).length;
  }

  backbtn() {
    this.router.navigate(['/Homepage'])
  }
}