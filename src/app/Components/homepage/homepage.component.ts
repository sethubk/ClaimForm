import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { ApiService } from '../../Services/Api Services/api.service';
import { Router } from '@angular/router';
import { Employee } from '../Models/claimmodels';
import { ClaimApiService } from '../../Services/Api Services/claim-api.service';
import '@cds/core/progress-circle/register.js';


export interface Claims {
  recentClaimId: string;
  type: 'International' | 'Domestic' | '' | string;
  date?: Date | null;
  purpose?: string;
  amount?: number | null;
  status: 'In progress' | 'Approved' | 'Rejected' | string;
  expense?: string;
}
export interface Personal {
  today: string;
  username: string;
  employeeCode: string;
  purposePlace: string;
  companyPlant: string;
  costCenter: string;
  vendorCode: string;
}
@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, ClarityModule, FormsModule, ReactiveFormsModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  constructor(private api: ApiService, private router: Router, private ClaimApi: ClaimApiService) { }
  username: string = '';
  showPersonalModal = false;



empcode :string ='';
dataSource:Claims[]=[];
 allClaims: Claims[] = [];
 
User:Employee={
  today: '',
  username: '',
  employeeCode: '',
  purposePlace: '',
  companyPlant: '',
  costCenter: '',
  vendorCost: '',
 
};

  isLoading = false;
  pendingCalls = 0;


  ngOnInit() {
    debugger
    this.isLoading = true;

    const now = new Date();
    const today = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });


    this.User = this.api.User;
    this.User.today = today
    this.empcode = this.User.employeeCode;
    // this.pendingCalls = 2;
    // this.getClaimUsingEmpCode();

    // this.getEmployees();
    this.getclaim();
    // this.getFetchclaims();

    this.isLoading = false

  }


  checkLoading() {

    if (this.pendingCalls === 0) {
      this.isLoading = false;  // hide spinner
    }
  }




getclaim(): void {
  this.ClaimApi.getClaimByEmpCode(this.empcode)
    .subscribe({
      next: (res: Claims[]) => {
        console.log('Claims fetched:', res);

        this.allClaims = res.filter(
          c => c.status !== 'Draft' && (c.amount ?? 0) > 0
        );

        this.dataSource = [...this.allClaims];
      },
      error: (err) => {
        console.error('Error fetching claims:', err);
      }
    });
}

// getclaim() {
//   this.api.GetEmployeewithClaim(this.empcode).subscribe(res => {
// console.log("Claimswith fetched:", res);
//     this.allClaims = (res as { recentClaims: Claims[] }).recentClaims
//       .filter(c => c.status !== 'Draft' && (c.amount ?? 0) > 0);

//     // Use a fresh copy for the grid
//     this.dataSource = [...this.allClaims];
//     console.log("Claims fetched:", this.dataSource);
//   });
// }


filterByType(type: string) {

  if (!type) {
    // Reset filter
    this.dataSource = [...this.allClaims];
    return;
  }

  this.dataSource = this.allClaims.filter(
    c => c.type?.toLowerCase() === type.toLowerCase()
  );

  console.log("Filtered:", this.dataSource);
}

  selectedCategory: string | null = null;
  personalForm = new FormGroup({
    purposePlace: new FormControl('', Validators.required)
  });
  goToPersonalDetails(category: string) {

    this.selectedCategory = category;
    this.showPersonalModal = true;

  }
  onPersonalNext() {
    //store the dates in 

    if (this.personalForm.invalid) {
      this.personalForm.markAllAsTouched();
      return;
    }
    {
      this.User.purposePlace = this.personalForm.value.purposePlace ?? '';
      sessionStorage.setItem('Employee', JSON.stringify(

        this.User));
      const today = new Date().toISOString().split('T')[0];

      const dto = {
        Type: this.selectedCategory,
        Purpose: this.User.purposePlace,
        Date: today,
        Amount: 0,
        Status: "Draft",
      }

      this.showPersonalModal = false;
      if (this.selectedCategory === 'Expense') {
        this.router.navigate(['/Expense'])
      }
      if (this.selectedCategory === 'InternationalTravels') {
        this.router.navigate(['/international'])
      }
      if (this.selectedCategory === 'DomesticTravels') {
        this.router.navigate(['/domestic, claimId'])
      }
      debugger
      this.api.createClaim(this.empcode, dto).subscribe(
        res => {
          console.log("claim created ", res);
          const claimId = res.recentClaimId;
          localStorage.setItem('lastClaimId', claimId)
        })
      console.log("Formsubmitted", this.User)

    }

  }
  //displayedColumns: string[] = ['type', 'createdDate', 'purposePlace', 'amount', 'status', 'expense'];

  getStatusClass(status: string): string {
    switch (status) {
      case 'Approved':
        return 'badge badge-success';
      case 'Pending':
        return 'badge badge-warning';
      case 'Rejected':
        return 'badge badge-danger';
      default:
        return 'badge badge-info';
    }
  }

  reset() {
    this.User.purposePlace = ''
  }

  godash() {
    this.router.navigate(['./dashboard'])
  }

  
goToClaimView(claimId: string) {
  this.router.navigate(['/claim-view', claimId]);
}

}
