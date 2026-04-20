import { Injectable } from '@angular/core';
import { CashInfoDtos } from '../Components/Models/claimmodels';

@Injectable({
  providedIn: 'root'
})
export class TravelEntryService {

  constructor() { }
  private cardEntries: any[] = [];
  private cashEntries: any[] = [];
private entries:any=[];
  getCardEntries() {
    return this.cardEntries;
  }

  getCashEntries() {
    return this.cashEntries;
  }
selectedCurrency: string = '';
getAvg(): number {
  let total = 0;
  let count = 0;

  this.cardCashEntries.forEach(x => {
    total += x.inrRate;
    count++;
  });

 

  return  total / count ;
}

 cardCashEntries: any[] = [];

addEntry(entry: any) {
  const totalInr = entry.inrRate * entry.totalLoaded;
  const newEntry = { ...entry, totalInr };

  this.cardCashEntries.push(newEntry);
}

addEntriesFromApi(entries: any[], currencyType: string) {
 

  entries.forEach(entry => {
    const totalInr = entry.inrRate * entry.totalLoadedAmount;

    this.cardCashEntries.push({
      id:entry.id,
      currerncy: currencyType,                  
      inrRate: entry.inrRate,
      totalLoaded: entry.totalLoadedAmount,     
      loadedDate: entry.loadedDate,
      totalInr: totalInr,
      type: entry.paymentType                                
    });
  });
  console.log("cardCashEntries in service", this.cardCashEntries);
}


 updateEntry(index: number, updatedEntry: any) {
  updatedEntry.totalInr = updatedEntry.inrRate * updatedEntry.totalLoaded;
  this.cardCashEntries[index] = updatedEntry;
}

deleteEntry(index: number) {
  this.cardCashEntries.splice(index, 1);
}

getAllEntries() {
  return this.cardCashEntries;
}

  setentries(entries:any[]){
this.entries=entries
}
getentries(){
  return this.entries
}

private allowanceAmount: number = 0;

  setAllowance(amount: number) : number {
    this.allowanceAmount = amount;
    return this.allowanceAmount;
  }

  getAllowance(): number {
    return this.allowanceAmount;
  }


clearCardEntries(): void {
  this.cardEntries = [];
  this.cashEntries=[];
   this.travelStart = '';
    this.travelEnd = '';
    this.allowanceAmount=0
    this.entries=[];
    this.cardCashEntries=[];
}

  private travelStart: string = '';
  private travelEnd: string = '';
  private selectedcurrencyType :string='';

  setTravelDates(start: string, end: string,currency:string) {
    this.travelStart = start;
    this.travelEnd = end;
    this.selectedcurrencyType=currency
  }


  getTravelStart(): string {
    return this.travelStart;
  }

  getTravelEnd(): string {
    return this.travelEnd;
  }

  getselectedcurrencyType():string{
    return this.selectedcurrencyType
  }
}
