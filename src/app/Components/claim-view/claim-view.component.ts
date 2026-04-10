import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../Services/Api Services/api.service';
import { ClaimApiService } from '../../Services/Api Services/claim-api.service';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
export interface ClaimDetailsResponse {
  recentClaimId: string;
  claimType: string;
  travelType?: string | null;
  travelDetails?: any;
  expenses: any[];
  internationalExpenses: any[];
}
``
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
  private ClaimApi: ClaimApiService
) {}
claimDetails!: ClaimDetailsResponse;

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


}
