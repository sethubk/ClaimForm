import { Injectable } from '@angular/core';
import { Expense, InternationalExpenseUI } from '../Components/Models/claimmodels';

@Injectable({
  providedIn: 'root'
})
export class ExpenseDataService {

  constructor() { }

  
  
  
private details: any = {};
private entries:any=[];
private expense:Expense[]=[];
  


  setDetails(data: any) {
    this.details = data;
  }

  getDetails() {
    return this.details;
  }
setentries(entries:Expense[]){
this.entries=entries
}
getentries(){
  return this.entries
  return this.expense
}
setExpense(data: Expense[])  {
  for(let i=0;i<data.length;i++){
    this.expense.push(data[i])
  }
 
}

setinternationalentries(entries:InternationalExpenseUI[]){
this.entries=entries
}
getExpense(){
  return this.expense
}
Clearentries(){
  this.entries=null;
}
}
