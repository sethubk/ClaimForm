import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Claims, ClaimStatusDto, ClaimUpdate, ClaimWithEmployeeDetails } from '../../Components/Models/claimmodels';

@Injectable({
  providedIn: 'root'
})
export class ClaimApiService {

  constructor(private http:HttpClient) { }

  baseurl='https://localhost:7283/api/RecentClaim';
  
  
 getClaimByEmpCode(employeeCode: string): Observable<Claims[]> {
    return this.http.get<Claims[]>(`${this.baseurl}/${employeeCode}/claims`);
  }


updateClaim(employeeCode:string,claimId: string, claim: ClaimUpdate): Observable<Claims> {
  return this.http.put<Claims>(
    `${this.baseurl}/${employeeCode}/${claimId}/claim`,
    claim
  );
}


updateClaimStatus(claimId: string, status: ClaimStatusDto):Observable<Claims> {
  return this.http.put<Claims>(`${this.baseurl}/${claimId}/claimstatus`, status);
}
getExpensesByClaimId(claimId: string): Observable<any> {
  return this.http.get(`${this.baseurl}/${claimId}/claim`);}



getAllClaims(): Observable<ClaimWithEmployeeDetails[]> {
  return this.http.get<ClaimWithEmployeeDetails[]>(`${this.baseurl}/Allclaims`);  

}}