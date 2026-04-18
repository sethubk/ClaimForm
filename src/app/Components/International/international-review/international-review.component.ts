import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExpenseDataService } from '../../../Services/expense-data.service';
import { TravelEntryService } from '../../../Services/travel-entry.service';
import { ClarityIcons } from '@clr/icons';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ClaimUpdate, Employee, Entry, InternationalExpense, InternationalExpenseUI } from '../../Models/claimmodels';
import { InternationalApiService } from '../../../Services/Api Services/international-api.service';
import { ClaimApiService } from '../../../Services/Api Services/claim-api.service';
import { ApiService } from '../../../Services/Api Services/api.service';
import { ToasterService } from '../../../Services/toaster.service';

@Component({
  selector: 'app-international-review',
  standalone: true,
  imports: [ClarityModule,CommonModule,ReactiveFormsModule],
  templateUrl: './international-review.component.html',
  styleUrl: './international-review.component.css'
})
export class InternationalReviewComponent {
constructor(private router:Router,private service:ExpenseDataService,
  private api:ApiService,
  private TravelService:TravelEntryService,
  private toastService: ToasterService,
  private InternationalExpenseapi:InternationalApiService,private ClaimApi:ClaimApiService){}
entries:InternationalExpense[]=[];
 personalData: Employee={ 
    today: '',
   username: '',
   employeeCode: '',
   purposePlace: '',
   companyPlant: '',
   costCenter: '',
   vendorCost: '',
  
 };
selectedCurrency: string = '';
advance:number=0;
  ngOnInit(): void {
 
    this.entries=this.service.getentries();
 this.personalData=this.api.User;
    this.advance=this.TravelService.getAllowance()
this.selectedCurrency = this.TravelService.selectedCurrency
    console.log(this.entries)
   
}

getTotalsByPaymentMode(): { mode: string; total: number }[] {
  const totals: { [key: string]: number } = {};

  this.entries.forEach(entry => {
    const mode = entry.paymentMode;
    const amount = Number(entry.convertedAmount );

    // Only include 'Cash' or 'Card' payment modes
    if (mode === 'Cash' || mode === 'Card') {
      if (!totals[mode]) {
        totals[mode] = 0;
      }
      totals[mode] += amount;
    }
  });

  return Object.keys(totals).map(mode => ({
    mode,
    total: totals[mode]
  }));
}
totalAmount: number = 0;

calculateTotal() {
  this.totalAmount = this.entries.reduce((sum, entry: Entry) => sum + entry.convertedAmount, 0);
console.log(this.totalAmount)

}
getGrandTotal(): number {
  return this.entries.reduce((sum, entry) => sum + Number(entry.convertedAmount), 0);
}
get totalAmounts(): number {
  return this.entries.reduce((sum, entry) => sum + Number(entry.convertedAmount || 0), 0);

}
printPage() {
  window.print();
}



getTotalByMode(mode: string): number {
  const totals = this.getTotalsByPaymentMode();
  const found = totals.find(t => t.mode === mode);
  return found ? found.total : 0;
}
loading = false;
 EditClaimId!: string;
claimId!:string
submitExpense() {
  debugger
  this.loading = true;
this.claimId = localStorage.getItem('lastClaimId')||localStorage.getItem('EditClaim')||'';
  this.EditClaimId=localStorage.getItem('EditClaim')||'';
 const payload = (this.entries ?? []).map((e: InternationalExpenseUI) => ({
    id:e.id,
    date: e.date ,
    supportingNo: e.supportingNo ?? "",
    particulars: e.particulars ?? "",
    paymentMode: e.paymentMode ?? "",
    currencyType: e.selectedCurrency_amt,
    amount: Number(e.amount) || 0,
    convertedAmount: Number(e.convertedAmount) || Number(e.amount) || 0,
    remarks: e.remarks ?? "",
    screenshot: e.screenshot ?? ""
  }));

 if(this.EditClaimId){
this.InternationalExpenseapi.updateExpense(this.EditClaimId,payload).subscribe({
    next: res => {
      console.log('International Expense Updated', res);
      this.loading = false;
    },
    error: err => {
      console.error('Expense ERROR:', err);
      console.error('Server says:', err.error);
      this.loading = false;
    }
  });
 }

  // ✅ Call International AddBulk API
  else{
this.InternationalExpenseapi.createExpense(this.claimId, payload).subscribe({
    next: res => {
      console.log('International Expense created', res);
      this.loading = false;
    },
    error: err => {
      console.error('Expense ERROR:', err);
      console.error('Server says:', err.error);
      this.loading = false;
    }
  });}
setInterval(() => {
}, 1000);
const totalConvertedAmount = payload.reduce(
  (sum, item) => sum + (item.convertedAmount || 0),
  0
);
const claim:ClaimUpdate = {
    status: "pending",
    amount: this.getSettlementDetails().amount
  };
debugger
  this.ClaimApi.updateClaim(
    this.api.User.employeeCode,
    this.claimId,
    claim
  ).subscribe({
    next: res => {
      console.log("Claim updated", res);
      this.loading = false;
//        this.api.sendmail(this.api.User.employeeCode,this.claimId).subscribe({
//   next: res => console.log('Email sent', res),
//   error: err => console.error('Email ERROR:', err)
// });
      this.toastService.success('Expense submitted and claim updated successfully');
      this.router.navigate(['/Homepage']).then(() => {
        setTimeout(() => window.location.reload(), 50);
      });
    },
    error: err => {
      this.toastService.error('Failed to submit expense. Please contact support.');
      console.error("Update claim error", err);
      this.loading = false;
    }
  });
  }





getSettlementDetails(): { message: string, amount: number, type: 'recover' | 'pay' | 'none' } {
  const cashPaid = this.totalAmounts;
  const difference =  cashPaid -this.advance ;

  if (difference < 0) {
    return { message: 'Amount Recover from Employee', amount: difference, type: 'recover' };
  } else if (difference > 0) {
    return { message: 'Amount Payable to Employee', amount: difference, type: 'pay' };
  } else {
    return { message: '', amount: 0, type: 'none' };
  }
}
 backbtn(){
this.router.navigate(['internationalcal'])
    }

}
