import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Claims } from '../../Components/Models/claimmodels';

@Injectable({
  providedIn: 'root'
})
export class ClaimApiService {

  constructor(private http:HttpClient) { }

  baseurl='https://localhost:7283/api/RecentClaim';
  
  
 getClaimByEmpCode(employeeCode: string): Observable<any> {
    return this.http.get(`${this.baseurl}/${employeeCode}/claim`);
  }


updateClaim(employeeCode:string,claimId: string, claim: any): Observable<Claims> {
  return this.http.put<Claims>(
    `${this.baseurl}/${employeeCode}/${claimId}/claim`,
    claim
  );
}

}
