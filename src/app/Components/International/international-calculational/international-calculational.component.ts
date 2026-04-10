import { Component } from '@angular/core';
import { FormDataModel, InternationalExpense, InternationalExpenseUI } from '../../Models/claimmodels';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TravelEntryService } from '../../../Services/travel-entry.service';
import { Router } from '@angular/router';
import { ExpenseDataService } from '../../../Services/expense-data.service';
import { ClarityIcons } from '@clr/icons';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../Services/Api Services/api.service';

@Component({
  selector: 'app-international-calculational',
  standalone: true,
  imports: [ClarityModule, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './international-calculational.component.html',
  styleUrl: './international-calculational.component.css'
})
export class InternationalCalculationalComponent {
  isEdit: boolean = false;
  personalData: any;
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
    // const fullStart = this.travelService.getTravelStart(); // e.g., "2025-10-30T09:00"
    // const fullEnd = this.travelService.getTravelEnd();     // e.g., "2025-11-05T18:00"
    this.selectedCurrency_amt = this.travelService.getselectedcurrencyType()
    //this.avg=this.travelService.getavg()
    // this.startDate = fullStart.split('T')[0]; // "2025-10-30"
    // this.endDate = fullEnd.split('T')[0];

    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];

    this.personalData = this.api.User;

    // Check if entries already exist

    const existingEntries = this.service.getentries();

    if (existingEntries && existingEntries.length > 0) {

      // let allowanceEntry = existingEntries.find((x: { particulars: string; }) => x.particulars == "Allowance");

      // let allowance = this.travelService.getAllowance();

      // if (allowanceEntry) {
      //   allowanceEntry.amount = allowance;
      // }
      this.service.setentries(existingEntries);

      // Load all entries (including allowance and user-added)
      this.entries = existingEntries;

    } else {
      // First time: only push allowance
      const allowance = this.travelService.getAllowance();
      console.log("calculation", allowance);

      // this.entries = [{
      //   paymentMode: 'cash',
      //   particulars: 'Allowance',
      //   amount: allowance || 0
      // }];


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
      selectedCurrency_amt: ['', Validators.required], // Currency dropdown
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

    let convertedAmount = 0;
    const amount = Number(formValue.amount) || 0;
    const currency = formValue.selectedCurrency_amt?.toUpperCase();

    if (currency === 'INR' || currency === 'IND') {
      // ✅ INR: no conversion
      convertedAmount = amount;
    } else {
      // ✅ Other currencies
      convertedAmount = amount * 100;
    }

    const entry = {
      ...formValue,
      convertedAmount,   // ✅ included for INR and others
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
    this.preview = '';

    this.formopen = true;
  }

  Editentry(entry: any, index: number) {
    this.formData = { ...entry };
    this.editIndex = index;
    this.formopen = true;
    this.isEdit = true;

    // ✅ Patch form with entry values
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

    // ✅ Recalculate converted amount for UI if needed


    console.log("Editing entry:", this.formData);
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
    this.router.navigate(['/internationalreview'])
  }
  backbtn() {
    this.router.navigate(['international'])
  }
}
