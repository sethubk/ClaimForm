import { Component } from '@angular/core';
import { ExpenseApiService } from '../../../Services/Api Services/expense-api.service';
import { Router } from '@angular/router';
import { TravelEntryService } from '../../../Services/travel-entry.service';
import { ExpenseDataService } from '../../../Services/expense-data.service';
import { ClarityIcons } from '@clr/icons';
import { ClarityModule } from '@clr/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Employee } from '../../Models/claimmodels';
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
  imports: [ClarityModule,FormsModule,CommonModule],
  templateUrl: './expensereview.component.html',
  styleUrl: './expensereview.component.css'
})
export class ExpensereviewComponent {
constructor(private service:ExpenseDataService,private api:ApiService, private router:Router,private toastService: ToasterService,
  private TravelService:TravelEntryService,private ExpenseApi:ExpenseApiService,private ClaimApi:ClaimApiService){

 }
 personalData: Employee={ 
    today: '',
   username: '',
   employeeCode: '',
   purposePlace: '',
   companyPlant: '',
   costCenter: '',
   vendorCost: '',
  
 };
 entries:Entry[]=[];
 
  ngOnInit(): void {
 this.personalData=this.api.User;
    this.entries=this.service.getentries();
   
    console.log(this.entries)

    this.calculateTotal();
  
  }
 totalAmount: number = 0;

calculateTotal() {
  this.totalAmount = this.entries.reduce((sum, entry: Entry) => sum + entry.amount, 0);
console.log(this.totalAmount)
}

printPage() {
  window.print();
}



loading = false;
submitExpense(){
  debugger
  this.loading = true;
const claimId = localStorage.getItem('lastClaimId');
if (!claimId) {
  console.error('No Claim ID found. Create claim first.');
  return;
}

const payload = (this.entries ?? []).map((e: any) => ({
  amount: Number(e.amount),
  date: e.date ,
  supportingNo: e.supportingNo ?? "",
  particulars: e.particulars ?? "",
  paymentMode: e.paymentMode ?? "",
  remarks: e.remarks ?? "",
  fileName: e.fileName ?? "",        // remove if not in DTO
  screenshot: e.fileName ?? ""     // send "" or make DTO string?
}));

this.ExpenseApi.createExpense(claimId, payload).subscribe({
  next: res => {console.log('Expense created', res);
this.toastService.success('Expense submitted successfully');

  },
  error: err => {
    console.error('Expense ERROR:', err);
    // check server message here:
    this.toastService.error('Failed to submit expense. Please try again.');
    // console.error('Server says:', err.error);
  }
});

const claim={
      status:"pending",
      amount:this.totalAmount
   
}

this.ClaimApi.updateClaim(this.api.User.employeeCode,claimId,claim).subscribe({
       next: res => {
      console.log("Claim updated", res);
      this.loading = false;
      this.toastService.success('Expense and claim submitted  successfully');
     this.api.sendmail(this.api.User.employeeCode,claimId).subscribe({
  next: res => console.log('Email sent', res),
  error: err => console.error('Email ERROR:', err)
});
setTimeout(() => {
      this.router.navigate(['/Homepage']);
    }, 1200);

    },
        error: (err2) => {
          console.error("Update claim error", err2);
          this.toastService.error('Failed to update claim. Please contact support.');
        }
         
      });
this.loading = false;



}

showClaimSummary() {
  const summary = `
    Type: Expense
    Created Date: ${new Date().toLocaleDateString()}
    Purpose & Place: ${this.personalData?.purposePlace}
    Total Amount: ₹{this.totalAmount}
  `;
 
  alert(summary);
}
backbtn(){
  this.router.navigate(['/Expense'])
}

}
