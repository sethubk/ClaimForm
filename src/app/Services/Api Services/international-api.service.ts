import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InternationalApiService {

 
   constructor(private http:HttpClient) { }
 
  travel = 'https://localhost:7283/api/InternationalTravel';
Internatioanl = 'https://localhost:7283/api/InternationalExpense';

addTravelDetails(ClaimId: string, data: any): Observable<any> {
  return this.http.post(`${this.travel}/${ClaimId}`, data);
}

}
