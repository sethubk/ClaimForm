import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../Services/Api Services/api.service';
import { ClaimApiService } from '../../Services/Api Services/claim-api.service';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { Claims } from '../homepage/homepage.component';
import { ClaimStatusDto } from '../Models/claimmodels';
import { ToasterService } from '../../Services/toaster.service';
export interface ClaimDetailsResponse {
  recentClaimId: string;
  claimType: string;
  travelType?: string | null;
  travelDetails?: any;
  expenses: any[];
  cardCashEntries: any[];
  internationalExpenses: any[];
  domesticExpenses: any[];
  claimStatus: string;
}

@Component({
  selector: 'app-claim-view',
  standalone: true,
  imports: [ClarityModule,CommonModule],
  templateUrl: './claim-view.component.html',
  styleUrl: './claim-view.component.css'
})
export class ClaimViewComponent {

constructor(
  private route: ActivatedRoute,
  private api: ApiService,
  private ClaimApi: ClaimApiService,
  private toastService: ToasterService
) {}
claimDetails!: ClaimDetailsResponse;
Claims:Claims[]=[];
claimId!: string;

ngOnInit() {
  this.claimId = this.route.snapshot.paramMap.get('claimId')!;
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
  this.ClaimApi.updateClaimStatus(claimId,payload).subscribe({
    next: (res) => {
      console.log('Withdraw successful');

      // Update UI status immediately
     this.claimDetails.claimStatus = 'Withdrawn';
      

      this.isWithdrawModalOpen = false;

      // Optional: show toast
      this.toastService.success('Claim withdrawn successfully');
      
    },
    error: (err) => {
      console.error(err);
      this.toastService.error('Failed to withdraw claim');
    }
  });
}

}
