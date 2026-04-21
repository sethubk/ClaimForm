import { Component, ElementRef, ViewChild } from '@angular/core';
import { Employee, FormDataModel, InternationalExpense, InternationalExpenseUI } from '../../Models/claimmodels';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TravelEntryService } from '../../../Services/travel-entry.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseDataService } from '../../../Services/expense-data.service';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../Services/Api Services/api.service';
import { InternationalApiService } from '../../../Services/Api Services/international-api.service';
import { loadCommerceIconSet } from '@cds/core/icon';
import { ToasterService } from '../../../Services/toaster.service';

@Component({
  selector: 'app-international-calculational',
  standalone: true,
  imports: [ClarityModule, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './international-calculational.component.html',
  styleUrl: './international-calculational.component.css'
})
export class InternationalCalculationalComponent {
  isEdit: boolean = false;
  personalData: Employee = {
    today: '',
    username: '',
    employeeCode: '',
    purposePlace: '',
    companyPlant: '',
    costCenter: '',
    vendorCost: '',

  };
  constructor(private fb: FormBuilder,
    private urlroute: ActivatedRoute,
    private api: ApiService,
    private internationalApi: InternationalApiService,
    private travelService: TravelEntryService,
    private router: Router,
    private toastService: ToasterService,
    private service: ExpenseDataService) { }
  maxDate: string = '';
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
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
  claimId!: string;
  EditClaim!: string;
  travelStart: string = '';
  travelEnd: string = '';
  internationalExpense: InternationalExpense[] = [];
  ngOnInit() {
    debugger
    this.claimId = localStorage.getItem('lastClaimId') || localStorage.getItem('EditClaim') || '';
    this.EditClaim = localStorage.getItem('EditClaim') || '';
    this.travelStart = this.travelService.getTravelStart();
    this.travelEnd = this.travelService.getTravelEnd();
    this.from1()
    if (this.EditClaim) {
      this.getInternationalExpenses();
    }
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
    this.service.setinternationalentries(this.entries);


  }
  getInternationalExpenses() {
    this.internationalApi.getInternationalExpensesByClaimId(this.claimId).subscribe({
      next: (res) => {
        console.log('International expenses:', res)
        this.service.setinternationalentries(res);
        this.entries = res
      },
      error: (err) => console.error('Error fetching international expenses:', err)
    });

  }
  expenseForm!: FormGroup;
  from1() {

    this.expenseForm = this.fb.group({
      id: '',
      date: ['', [Validators.required, this.maxDateValidator.bind(this)]],
      supportingNo: ['', Validators.required],
      particulars: ['', Validators.required],
      paymentMode: ['', Validators.required],
      currencyType: ['', Validators.required], // Currency dropdown
      amount: ['', [Validators.required, Validators.min(1)]], // Amount input
      remarks: [''],
      screenshot: ['', Validators.required],
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
getFileNameFromBase64(base64: string): string {
  if (!base64) {
    return 'Screenshot';
  }

  // Check if name exists in base64
  const nameMatch = base64.match(/name=([^;]+)/);
  if (nameMatch) {
    return nameMatch[1];
  }

  // Fallback: create name from MIME type
  const typeMatch = base64.match(/data:image\/(.*?);base64/);
  const ext = typeMatch ? typeMatch[1] : 'png';

  return `foodbill.${ext}`;
}

  maxDateValidator(control: any) {
    if (!control.value) return null;
    return new Date(control.value) > new Date(this.maxDate)
      ? { maxDate: true }
      : null;
  }
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  Filename: string = '';
  showModal: boolean = false;
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;
    this.Filename = file.name;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;

      // ✅ SET VALUE → REQUIRED FOR VALIDATION
      this.expenseForm.patchValue({
        screenshot: this.imagePreview
      });

      this.expenseForm.get('screenshot')?.updateValueAndValidity();
    };

    reader.readAsDataURL(file);
  }
  openGridImage(img: string) {
    console.log("Image clicked:", img);
    this.toastService.open(img);
  }
  removeImage() {
    this.imagePreview = null;
    this.fileInput.nativeElement.value = '';
    // reset form values
    this.expenseForm.patchValue({
      screenshot: null,
      fileName: ''
    });
  }
  addEntry() {

    if (this.expenseForm.valid) {

      const formValue = this.expenseForm.value;

      let convertedAmount = 0;
      const amount = Number(formValue.amount) || 0;
      const currency = formValue.currencyType.toUpperCase();

      if (currency === 'INR' || currency === 'IND') {
        //  INR: no conversion
        convertedAmount = amount;
      } else {
        //  Other currencies
        convertedAmount = amount * this.travelService.getAvg();
      }

      const entry = {
        ...formValue,
        convertedAmount,   //  included for INR and others
        screenshot: this.imagePreview,
        fileName: this.Filename
      };

      if (this.editIndex != null && this.isEdit) {
        this.entries[this.editIndex] = entry;
        this.editIndex = null;
        this.isEdit = false;
      } else {
        this.entries.push(entry);
      }

      this.formopen = false;
      this.service.setinternationalentries(this.entries);

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

  closeModal() {
    this.showDeleteModal = false;
    this.deleteIndex = null;
  }





  resetForm() {
    // ✅ Reset form
    this.expenseForm.reset();

    // ✅ Clear image preview
    this.imagePreview = null;

    // ✅ Clear file object
    this.selectedFile = null;

    // ✅ Clear file input (IMPORTANT)
    this.fileInput.nativeElement.value = '';

    // ✅ Re-apply required validation (for ADD mode)
    if (!this.isEdit) {
      this.expenseForm.get('screenshot')?.setValidators(Validators.required);
      this.expenseForm.get('screenshot')?.updateValueAndValidity();
    }
  }
  //open clarity model
  openmodel() {
    this.expenseForm.patchValue({
      screenshot: null,
      fileName: ''
    });
    this.expenseForm.reset()
    this.expenseForm.patchValue({ fileName: '' });
    this.expenseForm.patchValue({ screenshot: null });

    this.imagePreview = ''
    this.isEdit = false;

    this.fileInput.nativeElement.value = '';
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
    debugger
    this.formData = { ...entry };
    this.editIndex = index;
    this.formopen = true;
    this.isEdit = true;

    // ✅ Patch form with entry values
    this.expenseForm.patchValue({
      id: entry.id || '',
      date: entry.date,
      supportingNo: entry.supportingNo,
      particulars: entry.particulars,
      paymentMode: entry.paymentMode,
      selectedCurrency_amt: entry.selectedCurrency_amt,
      amount: entry.amount,
      remarks: entry.remarks,
      screenshot: entry.screenshot,
      fileName: entry.fileName,
      currencyType: entry.currencyType

    });
    this.imagePreview = entry.screenshot
    // ✅ Recalculate converted amount for UI if needed
    this.expenseForm.get('screenshot')?.clearValidators();
    this.expenseForm.get('screenshot')?.updateValueAndValidity();

    console.log("Editing entry:", this.formData);
  }
  // closeModal() {
  //   this.formopen = false;

  //   // ✅ Reset all form controls to their initial state
  //   this.expenseForm.reset({
  //     date: '',
  //     supportingNo: '',
  //     particulars: '',
  //     paymentMode: '',
  //     amount: '',
  //     remarks: '',
  //     screenshot: null,
  //     fileName: ''
  //   });

  //   // ✅ Clear additional properties

  //   this.preview = null; // If you have image preview
  //   this.isEdit = false;
  //   this.editIndex = null;
  // }
  gotoreview() {
    this.router.navigate(['/internationalreview'])
  }
  backbtn() {
    this.router.navigate(['international'])
  }
}
