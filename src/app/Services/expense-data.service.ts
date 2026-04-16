import { Injectable } from '@angular/core';
import { Expense } from '../Components/Models/claimmodels';

@Injectable({
  providedIn: 'root'
})
export class ExpenseDataService {

  constructor() { }

  
  
  
private details: any = {};
private entries:any=[];
private expense:any=[];



  setDetails(data: any) {
    this.details = data;
  }

  getDetails() {
    return this.details;
  }
setentries(entries:any){
this.entries=entries
}
getentries(){
  return this.entries
}
setExpense(data: Expense)  {
 this.expense.push(data);
}
getExpense(){
  return this.expense
}
Clearentries(){
  this.entries=null;
}
}
