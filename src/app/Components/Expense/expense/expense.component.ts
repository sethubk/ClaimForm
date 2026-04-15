import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { Employee, FormDataModel } from '../../Models/claimmodels';
import { ApiService } from '../../../Services/Api Services/api.service';
import { Router } from '@angular/router';
import { ExpenseDataService } from '../../../Services/expense-data.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [ClarityModule,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css'
})
export class ExpenseComponent {
 
preview: any;


constructor(private fb: FormBuilder,private api:ApiService,private router:Router,private Service:ExpenseDataService){}
 
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
  entries: FormDataModel[] = [];
 ngOnInit(){
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
  SelectedImg:File | null = null;
  onFileChange(event: any) 
  {
    debugger
    const file = event.target.files[0];
    if (file) {
      this.expenseForm.patchValue({ screenshot: file, 
        fileName:file.name });
       this.SelectedImg=file
    }
  }
  addEntry() {
    debugger

    if (this.expenseForm.valid) {
      const entry = {
        ...this.expenseForm.value,
        preview: this.preview ,
      file: this.SelectedImg 
        // include the image preview here
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
  removeentry(index: number) {
    const of = confirm("are you sure")
    if (of) {
      this.entries.splice(index, 1)
    }

  }




  //open clarity model
  openmodel() {

    this.expenseForm.reset()
    this.expenseForm.patchValue({ fileName: '' });

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
    this.router.navigate([''])
  }
}
