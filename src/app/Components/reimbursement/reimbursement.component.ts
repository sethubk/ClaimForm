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

  goToClaimView(claimId: string) {
    this.router.navigate(['/reimbursement', claimId]);
  }

  // 🔍 Search filter
  filterClaims(list: ClaimWithEmployeeDetails[]) {
    return list.filter(c =>
      !this.searchText ||
      c.empCode?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      c.name?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // 📊 Counts
  getCount(status: string) {
    return this.Claims.filter(c => c.status === status).length;
  }
}