import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseApiService {

  constructor(private http:HttpClient) { }

  baseurl='https://localhost:7283/api/Expense';

  
createExpense(claimId: string, expense: any): Observable<any> {
  return this.http.post(
    `${this.baseurl}/${claimId}`,
    expense
  );
}



}
