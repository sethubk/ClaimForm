import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../Services/Api Services/api.service';
import { ClaimApiService } from '../../Services/Api Services/claim-api.service';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { Claims } from '../homepage/homepage.component';
import { ClaimDetailsResponse, ClaimStatusDto, Entry } from '../Models/claimmodels';
import { ToasterService } from '../../Services/toaster.service';


@Component({
  selector: 'app-claim-view',
  standalone: true,
  imports: [ClarityModule, CommonModule],
  templateUrl: './claim-view.component.html',
  styleUrl: './claim-view.component.css'
})
export class ClaimViewComponent {

  constructor(
    private urlRoute: ActivatedRoute,
    private api: ApiService,
private router: Router,
    private ClaimApi: ClaimApiService,
    private toastService: ToasterService
  ) { }
  claimDetails!: ClaimDetailsResponse;
  Claims: Claims[] = [];
  claimId!: string;

  ngOnInit() {
    debugger
    this.claimId = this.urlRoute.snapshot.paramMap.get('claimId')!;
    localStorage.setItem('EditClaim', this.claimId);
    this.getClaimExpenses();
  }
  getClaimExpenses() {
  this.toastService.showLoader();

  this.ClaimApi.getExpensesByClaimId(this.claimId).subscribe({
    next: (res) => {
      console.log('Claim details fetched:', res);

      this.claimDetails = res;
      this.api.User.purposePlace = res?.purpose || '';
      this.api.User.today=res?.date ||'';
      
      this.toastService.hideLoader();
    },
    error: (err) => {
      console.error('Error fetching claim details:', err);

      // Optional: show error toast
      this.toastService.error('Failed to fetch claim expenses');

      this.toastService.hideLoader();
    }
  });
}
getFileNameFromBase64(base64: string): string {
  if (!base64) {
    return 'Screenshot';
  }

  // Check if name exists in base64
  const nameMatch = base64.match(/name=([^;]+)/);
  if (nameMatch) {
    return nameMatch[1];
  }

  // Fallback: create name from MIME type
  const typeMatch = base64.match(/data:image\/(.*?);base64/);
  const ext = typeMatch ? typeMatch[1] : 'png';

  return `foodbill.${ext}`;
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

  // Call backend
  withdrawClaim() {
     this.toastService.showLoader()
    const claimId = this.claimId
    const payload: ClaimStatusDto = {
      ClaimStatus: 'Withdrawn'
    };
    this.ClaimApi.updateClaimStatus(claimId, payload).subscribe({
      next: (res) => {
        console.log('Withdraw successful');

        // Update UI status immediately
        this.claimDetails.claimStatus = 'Withdrawn';

        
        this.isWithdrawModalOpen = false;
         this.toastService.hideLoader()
      
        this.toastService.success('Claim withdrawn successfully');

      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Failed to withdraw claim');
      this.toastService.hideLoader()
      }
    });
  }
  totalAmount: number = 0;
  calculateTotal() {
    if (this.claimDetails.claimType == 'InternationalTravels') {
      this.totalAmount = this.claimDetails.internationalExpenses.reduce((sum, entry: Entry) => sum + (entry.convertedAmount || 0), 0);
      console.log(this.totalAmount)
    }
    if (this.claimDetails.claimType == 'DomesticTravels') {
      this.totalAmount = this.claimDetails.domesticExpenses.reduce((sum, entry: Entry) => sum + (entry.amount || 0), 0);
      console.log(this.totalAmount)
    }
    if (this.claimDetails.claimType == 'Expense') {
      this.totalAmount = this.claimDetails.expenses.reduce((sum, entry: Entry) => sum + (entry.amount || 0), 0);
      console.log(this.totalAmount)
    }
    return this.totalAmount;
  }
  EditExpenses() {
    const claimId = this.claimId;
    if(this.claimDetails.claimType === 'Expense') {     
     this.router.navigate(['/Expense', claimId])
    // Implement the logic to navigate to the edit expenses page
  }
  if(this.claimDetails.claimType === 'InternationalTravels') {     
     this.router.navigate(['/InternationalTravels', claimId])
  }
  if(this.claimDetails.claimType === 'DomesticTravels') {     
     this.router.navigate(['/DomesticTravels', claimId])  
  }}

  openGridImage(img: string) {
  console.log("Image clicked:", img); 
this.toastService.open(img );
}
  }
