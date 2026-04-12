import { Component } from '@angular/core';
import { ClaimWithEmployeeDetails } from '../Models/claimmodels';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../Services/Api Services/api.service';
import { ClaimApiService } from '../../Services/Api Services/claim-api.service';
import { ToasterService } from '../../Services/toaster.service';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reimbursement',
  standalone: true,
  imports: [ClarityModule,CommonModule],
  templateUrl: './reimbursement.component.html',
  styleUrl: './reimbursement.component.css'
})
export class ReimbursementComponent {
Claims:ClaimWithEmployeeDetails[]=[];

constructor(private api: ApiService, private toastService: ToasterService,
    private router: Router, private ClaimApi: ClaimApiService)   { }

ngOnInit() {
  this.getclaims()
}

getclaims(){
  this.ClaimApi.getAllClaims().subscribe({
    next: (res) => {
      console.log("All claims fetched:", res);
      this.Claims = res.filter(
            c => c.status !== 'Draft' && (c.amount ?? 0) > 0
          );
    },
    error: (err) => {
      console.error("Error fetching claims:", err);
      this.toastService.error("Failed to load claims. Please try again later.");
    }
  });
}
goToClaimView(claimId: string) {
    this.router.navigate(['/reimbursement', claimId]);
  }

}
