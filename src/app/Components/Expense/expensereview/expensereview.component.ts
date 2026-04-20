import { Component } from '@angular/core';
import { ExpenseApiService } from '../../../Services/Api Services/expense-api.service';
import { Router } from '@angular/router';
import { TravelEntryService } from '../../../Services/travel-entry.service';
import { ExpenseDataService } from '../../../Services/expense-data.service';
import { ClarityIcons } from '@clr/icons';
import { ClarityModule } from '@clr/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Employee, Expense } from '../../Models/claimmodels';
import { ApiService } from '../../../Services/Api Services/api.service';
import { defaultEquals } from '@angular/core/primitives/signals';
import { ClaimApiService } from '../../../Services/Api Services/claim-api.service';
import { ToasterService } from '../../../Services/toaster.service';
import { devOnlyGuardedExpression } from '@angular/compiler';
interface Entry {
  date: string;
  supportingNo: string;
  particulars: string;
  paymentMode: string;
  amount: number;
  remarks: string;
}
@Component({
  selector: 'app-expensereview',
  standalone: true,
  imports: [ClarityModule, FormsModule, CommonModule],
  templateUrl: './expensereview.component.html',
  styleUrl: './expensereview.component.css'
})
export class ExpensereviewComponent {
  constructor(private service: ExpenseDataService, private api: ApiService, private router: Router, private toastService: ToasterService,
    private TravelService: TravelEntryService, private ExpenseApi: ExpenseApiService, private ClaimApi: ClaimApiService) {

  }
  personalData: Employee = {
    today: '',
    username: '',
    employeeCode: '',
    purposePlace: '',
    companyPlant: '',
    costCenter: '',
    vendorCost: '',

  };
  entries: Expense[] = [];

  ngOnInit(): void {
    this.personalData = this.api.User;
    this.entries = this.service.getentries();

    console.log(this.entries)

    this.calculateTotal();

  }
  totalAmount: number = 0;

  calculateTotal() {
    this.totalAmount = this.entries.reduce((sum, entry: Expense) => sum + entry.amount, 0);
    console.log(this.totalAmount)
  }

  printPage() {
    window.print();
  }

  EditClaimId!: string;
  claimId!: string
  loading = false;
 
submitExpense() {
  debugger;

  this.loading = true;

  this.claimId = localStorage.getItem('lastClaimId') || '';
  this.EditClaimId = localStorage.getItem('EditClaim') || '';

  const payload = (this.entries??[]).map((x:Expense) => ({
    id: x.id || null,
    date: x.date,
    supportingNo: x.supportingNo,
    particulars: x.particulars,
    paymentMode: x.paymentMode,
    amount: x.amount,
    remarks: x.remarks,
    fileName:x.fileName,
    screenshot: x.screenshot ??""
  }));

  const claim = {
    status: "pending",
    amount: this.totalAmount
  };

  // 🔥 COMMON SUCCESS HANDLER
  const updateClaimCall = (claimId: string) => {
  
    this.ClaimApi.updateClaim(this.api.User.employeeCode, claimId, claim).subscribe({
      next: res => {
        console.log("Claim updated", res);
        this.loading = false;
        this.toastService.success('Expense and claim submitted successfully');

        setTimeout(() => {
          this.router.navigate(['/Homepage']);
        }, 1200);
      },
      error: err => {
        console.error("Update claim error", err);
        this.loading = false;
        this.toastService.error('Failed to update claim.');
      }
    });
  };

  if (this.EditClaimId) {
    this.toastService.showLoader();
    this.ExpenseApi.UpdateExpesne(this.EditClaimId, payload).subscribe({
      next: res => {
        console.log('Expense updated', res);
        this.toastService.success('Expense updated successfully');

        updateClaimCall(this.EditClaimId); // ✅ only here
      },
      error: err => {
        console.error("Expense update error", err);
        this.loading = false;
        this.toastService.error('Failed to update expense');
      }
    });
  }

  
  else {
    this.toastService.showLoader();
    this.ExpenseApi.createExpense(this.claimId, payload).subscribe({
      next: res => {
        console.log('Expense created', res);
        this.toastService.success('Expense created successfully');

        updateClaimCall(this.claimId);
        this.toastService.hideLoader() // ✅ only here
      },
      error: err => {
        console.error('Expense ERROR:', err);
        this.loading = false;
        this.toastService.hideLoader()
        this.toastService.error('Failed to submit expense.');
      }
    });
  }
}







  backbtn() {
    this.router.navigate(['/Expense'])
  }

}
