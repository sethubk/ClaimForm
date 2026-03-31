import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilder, FormsModule, NgForm } from '@angular/forms';

import { Router } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { EntryModel, FormDataModel, TravelDetailsDtos } from '../../Models/claimmodels';
import { TravelEntryService } from '../../../Services/travel-entry.service';
import { InternationalApiService } from '../../../Services/Api Services/international-api.service';

@Component({
  selector: 'app-international',
  standalone: true,
  imports: [ClarityModule,FormsModule,CommonModule],
  templateUrl: './international.component.html',
  styleUrl: './international.component.css'
})
export class InternationalComponent {
  constructor(private fb: FormBuilder,private travelService: TravelEntryService, private router: Router,private internationalApi:InternationalApiService) { }

 travelStart: string = '';
  travelEnd: string = '';
  totaldays: number = 0;

  entries: FormDataModel[] = [];
  editIndex: number | null = null;
  editType: 'Card' | 'Cash' | null = null;
  maxDate: string = ''
  personalData: any;
  selectedCurrency: string = '';
  currencyModalOpen: boolean = false;
  formopen: boolean = false;

  entry: EntryModel = {
    type: 'Card',
    inrRate: null,
    totalLoaded: null,
    loadedDate: '',
    currerncy: ''
  };
  username: string = '';

  isEdit: boolean = false;
  formData: FormDataModel = {
    date: '',
    supportingNo: '',
    particulars: '',
    paymentMode: 'Cash',
    amount: null,
    remarks: '',
    screenshot: ''
  };

  
  ngOnInit(): void {

    this.travelStart = this.travelService.getTravelStart();
    this.travelEnd = this.travelService.getTravelEnd();

    const today = new Date();
    this.maxDate = today.toISOString().slice(0, 16); // 'yyyy-MM-ddTHH:mm'

    //this.personalData = this.service.getDetails();
    console.log('perso', this.personalData)

    
  }
  isInvalidDate: boolean = false;
  validateDate() {

    if (this.travelStart && this.maxDate) {
      this.isInvalidDate = new Date(this.travelStart) > new Date(this.maxDate);
      this.isInvalidDate = true
    } else {
      this.isInvalidDate = false;
    }
  }

  maxDateValidator(): boolean {
    if (!this.travelStart) return true;
    return new Date(this.travelStart) <= new Date(this.maxDate);
  }


  openmodel() {
    this.router.navigate(['/internationalcal']);
  }


  get travelEndDateOnly(): string {
    return this.travelEnd ? this.travelEnd.split('T')[0] : '';
  }

get cardEntries() {
  return this.travelService.getAllEntries().filter(x => x.type === 'Card');
}

get cashEntries() {
  return this.travelService.getAllEntries().filter(x => x.type === 'Cash');
}

 get totalEntries() {
  return this.travelService.getAllEntries()
    .reduce((sum, x) => sum + Number(x.totalInr ?? 0), 0);
}

  openCurrencyModal() {
    this.entry = {
      type: 'Card',
      inrRate: null,
      totalLoaded: null,
      loadedDate: '',
      currerncy: this.selectedCurrency
    };
    this.editIndex = null;
    this.editType = null;
    this.currencyModalOpen = true;
  }

  saveEntry(form: NgForm) {
  if (form.valid) {

    // assign type before saving
    this.entry.type = this.entry.type;   // <-- IMPORTANT

    if (this.editIndex !== null) {
      this.travelService.updateEntry(this.editIndex, this.entry);
    } else {
      this.entry.currerncy = this.selectedCurrency;
      this.travelService.addEntry(this.entry);
    }

    this.currencyModalOpen = false;
    this.editIndex = null;
  }
}
 editEntry(filteredIndex: number, type: 'Card' | 'Cash') {
  const all = this.travelService.getAllEntries();

  // find actual index in combined array
  const actualIndex = all.findIndex((x, i) =>
    x.type === type &&
    (
      type === 'Card'
        ? this.cardEntries.indexOf(x) === filteredIndex
        : this.cashEntries.indexOf(x) === filteredIndex
    )
  );

  this.entry = { ...all[actualIndex] };
  this.selectedCurrency = this.entry.currerncy;

  this.editIndex = actualIndex;
  this.currencyModalOpen = true;
}

deleteEntry(filteredIndex: number, type: 'Card' | 'Cash') {
  const all = this.travelService.getAllEntries();

  const actualIndex = all.findIndex((x, i) =>
    x.type === type &&
    (
      type === 'Card'
        ? this.cardEntries.indexOf(x) === filteredIndex
        : this.cashEntries.indexOf(x) === filteredIndex
    )
  );

  this.travelService.deleteEntry(actualIndex);
}

  calculateDays(start: string, end: string): number {
    if (!start || !end) return 0;

    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    const roundedDays = parseFloat(diffDays.toFixed(2));

    this.totaldays = roundedDays; // Assigning to totaldays as a string
    return roundedDays;
  }
  allowanceAmount: number = 0;

  calculateAllowance() {




    // const allowance = this.totaldays * 100;

    // this.allowanceAmount = this.travelService.getallowance() * allowance// ✅ Assign the result to the class property

    // this.travelService.setAllowance(this.allowanceAmount);
    this.allowanceAmount = this.travelService.setAllowance(this.totalEntries);

    return this.allowanceAmount;
  }


  gotoreview() {
const claimId = localStorage.getItem('lastClaimId');
if (!claimId) {
  console.error('No Claim ID found. Create claim first.');
  return;
}
    this.travelService.setTravelDates(this.travelStart, this.travelEnd ,this.selectedCurrency);
    const allowance = this.calculateAllowance()

const data = {
  currencyType: String(this.selectedCurrency),
  travelStartDate: String(this.travelStart),
  travelEndDate: String(this.travelEnd),
  totalDays: String(this.totaldays),
  advanceAmount: String(this.allowanceAmount),

  cardCashEntries: this.travelService.cardCashEntries.map(x => ({
    loadedDate: String(x.loadedDate),
    type: String(x.type),
    inrRate: String(x.inrRate),
    totalLoaded: String(x.totalLoaded)
  }))
};
this.internationalApi.addTravelDetails(claimId, data).subscribe({
  next: (res) => console.log("travelSaved", res),
  error: (err) => console.error(err)
});

    this.router.navigate(['internationalcal'])

    console.log("cal", this.allowanceAmount)
  }

  backbtn() {
    this.router.navigate([''])
  }
}
