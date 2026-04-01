export interface Employee{
  venderCost: string;

  
  today: string; 
  username:string;  
  employeeCode:string; 
  purposePlace:string;  
  companyPlant :string; 
  costCenter: string; 

  
}

export interface Claims {
  type: 'International' | 'Domestic' | '' | string;
  createdDate?: Date | null;
  purposePlace?: string;
  totalAmount?: number | null;
  status: 'In progress' | 'Approved' | 'Rejected' | string;
  expense?: string;
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
}