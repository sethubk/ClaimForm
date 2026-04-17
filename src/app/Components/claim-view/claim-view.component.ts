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
    this.claimId = this.urlRoute.snapshot.paramMap.get('claimId')!;
    localStorage.setItem('EditClaim', this.claimId);
    this.getClaimExpenses();
  }
  getClaimExpenses() {
    this.ClaimApi.getExpensesByClaimId(this.claimId).subscribe(res => {
      console.log("Claim details fetched:", res);
      this.claimDetails = res;

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

  // Call backend
  withdrawClaim() {
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

      
        this.toastService.success('Claim withdrawn successfully');

      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Failed to withdraw claim');
      }
    });
  }
  totalAmount: number = 0;
  calculateTotal() {
    if (this.claimDetails.claimType == 'InternationalTravels') {
      this.totalAmount = this.claimDetails.internationalExpenses.reduce((sum, entry: Entry) => sum + (entry.amount || 0), 0);
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
this.toastService.bilopen(img );
}
  }
