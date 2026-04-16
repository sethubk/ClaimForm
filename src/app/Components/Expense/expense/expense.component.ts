import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { Employee, Expense, FormDataModel } from '../../Models/claimmodels';
import { ApiService } from '../../../Services/Api Services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseDataService } from '../../../Services/expense-data.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseApiService } from '../../../Services/Api Services/expense-api.service';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [ClarityModule,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css'
})
export class ExpenseComponent {
 
preview: any;
Expenseid!: string;
Expense:Expense[]=[];
constructor(private urlroute: ActivatedRoute, 
   private fb: FormBuilder,private api:ApiService,
   private ExpanseApi:ExpenseApiService,
   private router:Router,private Service:ExpenseDataService){}
  
personalData: Employee={ 
   today: '',
  username: '',
  employeeCode: '',
  purposePlace: '',
  companyPlant: '',
  costCenter: '',
  vendorCost: '',
 
};
 formData: FormDataModel = {
    date: '',
    supportingNo: '',
    particulars: '',
    paymentMode: 'Cash',
    amount: null,
    remarks: '',
    screenshot: '',
    fileName: ''

  };
formopen: boolean = false;
  maxDate: string = '';
 editIndex: number | null = null;
  isEdit: boolean = false;
 isFutureDate: boolean = false;
  entries: Expense[] = [];
 ngOnInit(){
  debugger
    this.Expenseid = this.urlroute.snapshot.paramMap.get('claimId')!;
if(this.Expenseid){
  this.getExpenseDetails();

}
   this.personalData=this.api.User;
   const today = new Date();
    this.maxDate = today.toISOString().split('T')[0]; // Format: yyyy-MM-dd
    
    //this.formData=new FormGroup({date:new FormControl('',[Validators.required,maxDateInclusiveValidator(this.maxDate)])})
    const existingEntries = this.Service.getentries()
    if (existingEntries && existingEntries.length > 0) {
      // Load all entries (including allowance and user-added)
      this.entries = existingEntries;
    }
    this.from1()
 }

 getExpenseDetails(){
  this.ExpanseApi.getExpensesByClaimId(this.Expenseid).subscribe({

    next: (res:Expense) => {
      this.Expense.push(res);
      console.log('expense details2:', this.Expense);
      console.log('expense details:', res);
      this.Service.setExpense(res);
      this.entries.push(res);
      this.Service.setentries(this.entries);
      // this.entries = res.map((expense: Expense) => ({
      //   date: expense.date,
      //   supportingNo: expense.supportingNo,
      //   particulars: expense.particulars,
      //   paymentMode: expense.paymentMode,
      //   amount: expense.amount,
      //   remarks: expense.remarks,
      //   screenshot: expense.screenshot,
      //   fileName: expense.fileName
      // }));
      // this.Service.setentries(this.entries);
      this.Expense.push(res);
    },
    
    error: (err) => {
      console.error('Error fetching expense details:', err);
    }

  });
 }

 validateDate(): void {
    if (!this.formData.date) {
      this.isFutureDate = false;
      return;
    }
    this.isFutureDate = new Date(this.formData.date) > new Date(this.maxDate);
  }

  isDateValid(): boolean {
    if (!this.formData.date) return true;
    return new Date(this.formData.date) <= new Date(this.maxDate);
  }
  expenseForm!: FormGroup;
  from1() {

    this.expenseForm = this.fb.group({
      date: ['', [Validators.required, this.maxDateValidator.bind(this)]],
      supportingNo: ['', Validators.required],
      particulars: ['', Validators.required],
      paymentMode: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      remarks: [''],
      screenshot: [null],
      fileName: ''
    });

    this.expenseForm.get('particulars')?.valueChanges.subscribe(value => {
      const remarksControl = this.expenseForm.get('remarks');
      if (value === 'Others') {
        remarksControl?.setValidators([Validators.required]);
      } else {
        remarksControl?.clearValidators();
      }
      remarksControl?.updateValueAndValidity();
    });

  }

  maxDateValidator(control: any) {
    if (!control.value) return null;
    return new Date(control.value) > new Date(this.maxDate)
      ? { maxDate: true }
      : null;
  }
  onFileChange(event: any) 
  {
    debugger
    const file = event.target.files[0];
    if (file) {
      this.expenseForm.patchValue({ screenshot: file, 
        fileName:file.name });
    }
  }
  addEntry() {
    debugger

    if (this.expenseForm.valid) {
      const entry = {
        ...this.expenseForm.value,
        preview: this.preview // include the image preview here
      };

      if (this.editIndex != null && this.isEdit) {
        // Update existing entry
        this.entries[this.editIndex] = entry;
        this.editIndex = null;
        this.isEdit = false;
      } else {
        // Add new entry
        this.entries.push(entry);
      }

      this.formopen = false;

      // Save entries using the service
      this.Service.setentries(this.entries);
    }


  }
  deleteIndex: number | null = null;
showDeleteModal = false;

removeentry(index: number) {
  this.deleteIndex = index;
  this.showDeleteModal = true;
}

confirmDelete() {
  if (this.deleteIndex !== null) {
    this.entries.splice(this.deleteIndex, 1);
  }
  this.closeModal();
}






  //open clarity model
  openmodel() {

    this.expenseForm.reset()
    this.expenseForm.patchValue({ fileName: '' });
    this.expenseForm.patchValue({screenshot: null });

    this.isEdit = false;


    this.expenseForm.reset({
      date: '',
      supportingNo: '',
      particulars: '',
      paymentMode: '',
      amount: '',
      remarks: '',
      screenshot: null,
      fileName: ''
    });
   

    this.formopen = true;
  }

  Editentry(entry: any, index: number) {

    this.formData = ({ ...entry })
    this.editIndex = index;
    this.formopen = true
    this.isEdit = true;
      this.expenseForm.patchValue({
    date: entry.date,
    supportingNo: entry.supportingNo,
    particulars: entry.particulars,
    paymentMode: entry.paymentMode,
    selectedCurrency_amt: entry.selectedCurrency_amt,
    amount: entry.amount,
    remarks: entry.remarks,
    screenshot: entry.screenshot,
    fileName: entry.fileName
  });

    console.log("forms", this.formData);


  }
  closeModal() {
    this.formopen = false;
  this.showDeleteModal = false;
  this.deleteIndex = null;
    // ✅ Reset all form controls to their initial state
    this.expenseForm.reset({
      date: '',
      supportingNo: '',
      particulars: '',
      paymentMode: '',
      amount: '',
      remarks: '',
      screenshot: null,
      fileName: ''
    });

    // ✅ Clear additional properties

    this.preview = null; // If you have image preview
    this.isEdit = false;
    this.editIndex = null;
  }

  gotoreview() {
    this.router.navigate(['expensereview'])
  }
  backbtn() {
    this.router.navigate(['/Homepage'])
  }
}
