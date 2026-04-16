import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InternationalApiService {

 
   constructor(private http:HttpClient) { }
 
  private readonly travel = 'https://localhost:7283/api/InternationalTravel';
private readonly Internatioanl = 'https://localhost:7283/api/InternationalExpense';

addTravelDetails(ClaimId: string, data: any): Observable<any> {
  return this.http.post(`${this.travel}/${ClaimId}/InternationalTravel`, data);
}
getTravelDetails(ClaimId: string): Observable<any> {
  return this.http.get(`${this.travel}/${ClaimId}/InternationalTravel`);
}

createExpense(ClaimId: string, payload: any[]): Observable<any> {
    return this.http.post(
      `${this.Internatioanl}/${ClaimId}/InternationalExpense`,
      payload
    );
  }
getInternationalExpensesByClaimId(ClaimId: string): Observable<any> {
  return this.http.get(`${this.Internatioanl}/${ClaimId}/InternationalExpense`);
}}
