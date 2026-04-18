import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm, FormGroup, FormControl, Validators, ReactiveFormsModule, RequiredValidator } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { ApiService } from '../../Services/Api Services/api.service';
import { Router } from '@angular/router';
import { Employee } from '../Models/claimmodels';
import { ClaimApiService } from '../../Services/Api Services/claim-api.service';
import '@cds/core/progress-circle/register.js';
import { ToasterService } from '../../Services/toaster.service';
import { ExpenseDataService } from '../../Services/expense-data.service';
import { TravelEntryService } from '../../Services/travel-entry.service';


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
  constructor(private api: ApiService, private toastService: ToasterService,
    private router: Router, private ClaimApi: ClaimApiService,
    private expenseDataService: ExpenseDataService,private travelEntryService: TravelEntryService) { }
  username: string = '';
  showPersonalModal = false;



  empcode: string = '';
  dataSource: Claims[] = [];
  allClaims: Claims[] = [];

  User: Employee = {
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
   this.expenseDataService.Clearentries();
this.travelEntryService.clearCardEntries();
localStorage.clear()
    this.isLoading = true;

    const now = new Date();
    const today = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });


    this.User = this.api.User;
     this.empcode = this.api.User.employeeCode;
    this.User.today = today
   
    this.getclaim();

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
            c => c.status !== 'Draft' 
          );

          this.dataSource = [...this.allClaims];
          
        },
        error: (err) => {
          console.error('Error fetching claims:', err);
         
        }
      });
  }

getRoundedAmount(amount?: number | null): number {
  return Math.round(Math.abs(amount ?? 0));
}


resetFilters() {

  this.dataSource = [...this.allClaims];
}
  filterByType(type: string) {

    if (!type) {
       
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
        this.router.navigate(['/domestic'])
      }
     
      this.api.createClaim(this.empcode, dto).subscribe({
        next: (res) => {
          console.log('Claim created', res);

          const claimId = res.recentClaimId;
          localStorage.setItem('lastClaimId', claimId);

       
        },
        error: (err) => {
          console.error('Error creating claim', err);

        
         
        }
      });

      console.log('Form submitted', this.User);

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

       case 'Withdrawn':
        return 'badge badge-secondary';
      default:
        return 'badge badge-info';
    }
  }

 getReimbursement(amount: number): {
  label: string;
  cssClass: 'pay' | 'recover' | 'settled';
} {
  if (amount < 0) {
    return {
      label: 'Recoverable',
      cssClass: 'recover'
    };
  } else if (amount > 0) {
    return {
      label: 'Payable',
      cssClass: 'pay'
    };
  } else {
    return {
      label: 'Settled',
      cssClass: 'settled'
    };
  }
}
  resetPersonalForm(){
    this.personalForm.controls.purposePlace.setValue('');
    this.personalForm.controls.purposePlace.removeValidators(Validators.required);
    this.personalForm.controls.purposePlace.updateValueAndValidity();
    this.showPersonalModal = false;
  }

  godash() {
    this.router.navigate(['./dashboard'])
  }
isadmin():boolean{

  return this.api.isAdmin();
}
  goadmin(){
    this.router.navigate(['/reimbursement'])
  }

  goToClaimView(claimId: string) {
    this.router.navigate(['/claim-view', claimId]);
  }

}
