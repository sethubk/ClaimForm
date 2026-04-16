export interface Employee{
  vendorCost: string;

  
  today: string; 
  username:string;  
  employeeCode:string; 
  purposePlace:string;  
  companyPlant :string; 
  costCenter: string; 

  
}
export interface ClaimDetailsResponse {
  recentClaimId: string;
  claimType: string;
  travelType?: string | null;
  travelDetails?: any;
  expenses: any[];
  cardCashEntries: any[];
  internationalExpenses: any[];
  domesticExpenses: any[];
  claimStatus?: string;
  empcode: string;
  totalAmount?: number;
}

export interface Claims {
  recentClaimId: string;
  type: 'International' | 'Domestic' | '' | string;
  date?: Date | null;
  purpose?: string;
  amount?: number | null;
  status: 'In progress' | 'Approved' | 'Rejected' | string;
  expense?: string;
}


export interface EntryModel {
  type: 'Card' | 'Cash' | 'Online' | string;
  inrRate: number | null;
  totalLoaded: number | null;
  loadedDate: string;
  currerncy: string;
}

export interface CashInfoDtos {
  loadedDate: string;
  type: string;
  inrRate: string;
  totalLoaded: string;
  paymentType: string;
}

export interface TravelDetailsDtos {
  currencyType: string;
  travelStartDate: string;
  travelEndDate: string;
  totalDays: Number;
  advanceAmount: number;
  cardCashEntries: CashInfoDtos[];
}
export interface Entry {
  date: string;
  supportingNo: string;
  particulars: string;
  paymentMode: string;
  amount: number;
  remarks: string;
  convertedAmount: number;
}



export interface InternationalExpenseUI {
  date?: Date | string;
  supportingNo?: string;
  particulars?: string;
  paymentMode?: string;

  // UI-only fields
  selectedCurrency_amt?: string;
  amount?: string | number;
  convertedAmount?: string | number;
  remarks?: string;
  screenshot?: string;
  fileName?: string;
  currencyType?:string;
  file?: File;
}
export interface InternationalExpense {
  date: string;
  supportingNo: string;
  particulars: string;
  paymentMode: string;
  currencyType: string;
  amount: number;
  convertedAmount: number;
  remarks: string;
  screenshot: string;
}


export interface ClaimUpdate {
  /** Claim status (Pending, Approved, Rejected, etc.) */
  status: string;

  /** Total / updated claim amount */
  amount: number;
}
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  type: ToastType;
  message: string;
}


export interface ClaimStatusDto {
  ClaimStatus: string;
}

export interface ClaimWithEmployeeDetails {
  recentClaimId: string;
  type: 'International' | 'Domestic' | '' | string;
  date?: Date | null;
  purpose?: string;
  amount?: number | null;
  status: 'In progress' | 'Approved' | 'Rejected' | string;
 name: string;
 empCode: string;
}

export interface DomesticExpense {
  /** Date in YYYY-MM-DD format (no time) */
  date: string;

  /** Invoice / receipt reference number */
  supportingNo: string;

  /** Expense description */
  particulars: string;

  /** Payment mode (Cash, Card, Online, etc.) */
  paymentMode: string;

  /** Expense amount */
  amount: number;

  /** Additional remarks */
  remarks: string;
  fileName?: string;
  /** Receipt / screenshot file name or URL */
  screenshot: string;
}
export interface Expense {
  date: string;               // ISO date string
  supportingNo: string;
  particulars: string;
  paymentMode: 'Cash' | 'Card';
  amount: number;
  remarks?: string;
  screenshot?: string; 
  fileName: '' 
   preview?: string;      // base64 / file path / URL
}
export interface FormDataModel {
  date: string;
  supportingNo: string;
  particulars: string;
  paymentMode: 'Cash' | 'Card' | 'Online' | string;
  amount: number | null;
  remarks: string;
  screenshot: string;
   preview?: string;
   fileName?:string
}