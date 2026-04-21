import { Component } from '@angular/core';
import { ClaimDetailsResponse, Claims, ClaimStatusDto } from '../Models/claimmodels';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../Services/Api Services/api.service';
import { ClaimApiService } from '../../Services/Api Services/claim-api.service';
import { ToasterService } from '../../Services/toaster.service';
import { ClarityIcons } from '@clr/icons';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { thinClientIconName } from '@cds/core/icon';

@Component({
  selector: 'app-reimbursement-claim',
  standalone: true,
  imports: [ClarityModule, CommonModule, FormsModule],
  templateUrl: './reimbursement-claim.component.html',
  styleUrl: './reimbursement-claim.component.css'
})
export class ReimbursementClaimComponent {


  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private ClaimApi: ClaimApiService,
    private toastService: ToasterService,
    private router:Router
  ) { }
  claimDetails!: ClaimDetailsResponse;
  Claims: Claims[] = [];
  claimId!: string;

  ngOnInit() {
    this.claimId = this.route.snapshot.paramMap.get('claimId')!;
    this.getClaimExpenses();
  }
getClaimExpenses() {
  this.toastService.showLoader();

  this.ClaimApi.getExpensesByClaimId(this.claimId).subscribe({
    next: (res) => {
      console.log('Claim details fetched:', res);
      this.claimDetails = res;
      this.toastService.hideLoader();
    },
    error: (error) => {
      console.error('Error fetching claim expenses:', error);

      // Optional: show error message
      this.toastService.error('Failed to load claim expenses');

      this.toastService.hideLoader();
    }
  });
}

  isExpense(): boolean {
    return this.claimDetails?.claimType === 'Expense';
  }

  isInternational(): boolean {
    return this.claimDetails?.claimType === 'InternationalTravels';
  }

  isDomestic(): boolean {
    return this.claimDetails?.claimType === 'DomesticTravels';
  }
  isWithdrawModalOpen = false;

  // Open modal
  confirmWithdraw() {
    this.isWithdrawModalOpen = true;
  }

getFileNameFromBase64(base64: string): string {
  if (!base64) {
    return 'proof of Expense';
  }

  // Check if name exists in base64
  const nameMatch = base64.match(/name=([^;]+)/);
  if (nameMatch) {
    return nameMatch[1];
  }

  // Fallback: create name from MIME type
  const typeMatch = base64.match(/data:image\/(.*?);base64/);
  const ext = typeMatch ? typeMatch[1] : 'png';

  return `proof of Expense.${ext}`;
}
  openGridImage(img: string) {
  console.log("Image clicked:", img); 
this.toastService.bilopen(img );
}
  //Call backend
  withdrawClaim() {
this.toastService.showLoader()
    const claimId = this.claimId

    const payload: ClaimStatusDto = {
      ClaimStatus: this.selectedAction
    };

    this.ClaimApi.updateClaimStatus(claimId, payload).subscribe({
      next: (res) => {
        console.log('Withdraw successful');
this.toastService.hideLoader()
        // Update UI status immediately
        this.claimDetails.claimStatus = this.selectedAction;

        this.api.AdminAction(this.claimDetails.empcode, claimId).subscribe({
          next: (res) => {
            console.log('Admin action email sent successfully')
          },
          error: (err) => {
            this.toastService.error('Failed to send admin action email. Please contact support.');
          this.toastService.hideLoader()
          }
        });
        this.isWithdrawModalOpen = false;

        // Optional: show toast
        this.toastService.success(`Claim ${this.selectedAction} successfully`);

      },
      error: (err) => {
        console.error(err);
        this.toastService.hideLoader()
        this.toastService.error(`Failed to ${this.selectedAction} claim`);
      }
    });
  }


  selectedAction: string = '';

  getButtonClass() {
    if (this.selectedAction === 'Approved') {
      return 'approved-btn';
    } else if (this.selectedAction === 'Rejected') {
      return 'rejected-btn';
    } else {
      return 'default-btn';
    }
  }
backbtn() {
    this.router.navigate(['/reimbursement'])
  }
}
