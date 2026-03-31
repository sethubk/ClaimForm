import { Injectable } from '@angular/core';

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

// getavg() : number{
//   let InrRate = 0;
//   let totalInr = 0;
//   let avg = 0;
//   this.cardEntries.forEach(x=>{
//    InrRate +=  x['totalLoaded'];
//    totalInr += x['totalInr'];

//   })

//   this.cashEntries.forEach(x=>{
//    InrRate +=  x['totalLoaded'];
//    totalInr += x['inrRate'];

//   })
//   avg = totalInr/InrRate

//   return avg ;
// }

 cardCashEntries: any[] = [];

addEntry(entry: any) {
  const totalInr = entry.inrRate * entry.totalLoaded;
  const newEntry = { ...entry, totalInr };

  this.cardCashEntries.push(newEntry);
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

  setentries(entries:any){
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
