import { Component } from '@angular/core';
import { Employee, FormDataModel, InternationalExpense, InternationalExpenseUI } from '../../Models/claimmodels';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TravelEntryService } from '../../../Services/travel-entry.service';
import { Router } from '@angular/router';
import { ExpenseDataService } from '../../../Services/expense-data.service';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../Services/Api Services/api.service';

@Component({
  selector: 'app-domestic-calculation',
  standalone: true,
  imports: [ClarityModule, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './domestic-calculation.component.html',
  styleUrl: './domestic-calculation.component.css'
})
export class DomesticCalculationComponent {
isEdit: boolean = false;
  personalData: Employee={ 
     today: '',
    username: '',
    employeeCode: '',
    purposePlace: '',
    companyPlant: '',
    costCenter: '',
    vendorCost: '',
   
  };
  constructor(private fb: FormBuilder, private api: ApiService, private travelService: TravelEntryService, private router: Router, private service: ExpenseDataService) { }
  maxDate: string = '';

  startDate: string = '';
  endDate: string = '';
  showMax: boolean = false;

  isFutureDate: boolean = false;
  formopen: boolean = false;
  entries: InternationalExpenseUI[] = [];
  index1: number = this.entries.length
  editIndex: number | null = null;
  editType: 'Card' | 'Cash' | null = null;
  avg: number = 0;
  preview: any;
  selectedCurrency_amt: string = ''
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
  ngOnInit() {

    this.from1()
   
    this.selectedCurrency_amt = this.travelService.getselectedcurrencyType()
   

    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];

    this.personalData = this.api.User;

    // Check if entries already exist

    const existingEntries = this.service.getentries();

    if (existingEntries && existingEntries.length > 0) {

      
      this.service.setentries(existingEntries);

      // Load all entries (including allowance and user-added)
      this.entries = existingEntries;

    } else {
      // First time: only push allowance
      const allowance = this.travelService.getAllowance();
      console.log("calculation", allowance);

   
    }
    // Save to service
    this.service.setentries(this.entries);


  }

  expenseForm!: FormGroup;
  from1() {

    this.expenseForm = this.fb.group({
      date: ['', [Validators.required, this.maxDateValidator.bind(this)]],
      supportingNo: ['', Validators.required],
      particulars: ['', Validators.required],
      paymentMode: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]], // Amount input
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

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.expenseForm.patchValue({ screenshot: file, fileName: file.name });
    }
  }
addEntry() {
  if (this.expenseForm.valid) {
    const formValue = this.expenseForm.value;

   

    const entry = {
      ...formValue,
        //  included for INR and others
      preview: this.preview
    };

    if (this.editIndex != null && this.isEdit) {
      this.entries[this.editIndex] = entry;
      this.editIndex = null;
      this.isEdit = false;
    } else {
      this.entries.push(entry);
    }

    this.formopen = false;
    this.service.setentries(this.entries);

    console.log('Current entries:', this.entries);
  }
}
 deleteIndex: number | null = null;
showDeleteModal = false;

removeEntry(index: number) {
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
    this.preview = '';

    this.formopen = true;
  }

  Editentry(entry: any, index: number) {
    this.formData = { ...entry };
    this.editIndex = index;
    this.formopen = true;
    this.isEdit = true;

    this.expenseForm.patchValue({
      date: entry.date,
      supportingNo: entry.supportingNo,
      particulars: entry.particulars,
      paymentMode: entry.paymentMode,
     
      amount: entry.amount,
      remarks: entry.remarks,
      screenshot: entry.screenshot,
      fileName: entry.fileName
    });

    //  Recalculate converted amount for UI if needed


    console.log("Editing entry:", this.formData);
  }
  closeModal() {
    this.formopen = false;
  this.showDeleteModal = false;
  this.deleteIndex = null;
    //  Reset all form controls to their initial state
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

    //  Clear additional properties

    this.preview = null; // If you have image preview
    this.isEdit = false;
    this.editIndex = null;
  }
  gotoreview() {
    this.router.navigate(['/domesticreview'])
  }
  backbtn() {
    this.router.navigate(['/domestic'])
  }
}
