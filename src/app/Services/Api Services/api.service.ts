import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee } from '../../Components/Models/claimmodels';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
User:Employee={
  today: '',
  username: '',
  employeeCode: '',
  purposePlace: '',
  companyPlant: '',
  costCenter: '',
  vendorCost: ''
}

  constructor(private http:HttpClient) {
this.loadUserFromSession();

   }
  baseurl='https://localhost:7283/api/Employee';
claimUrl='https://localhost:7283/api/RecentClaim';
 Mailurl='https://localhost:7283/api/Mail';
  Login(data:any):Observable<any>{
    return this.http.post(`${this.baseurl}`,data)
  }
//  private currentUserSubject = new BehaviorSubject<any>(null);
//  currentUser$ = this.currentUserSubject.asObservable();

//  setUser(user: any) {
//    this.currentUserSubject.next(user);
//  }
 loadUserFromSession() {
   const user = sessionStorage.getItem('User');
   if (user) {
    const userObj = JSON.parse(user);
    const User=userObj.res;

    this.User.username=User.name;
  this.User.employeeCode=User.empCode;
  this.User.vendorCost=User.vendorCost;
  this.User.costCenter=User.costCenter;
  this.User.companyPlant="Nordex"
       // convert string → object
console.log("USers from session ",userObj)
  console.log("USers",this.User);
   }
 }
//  getCurrentUser() {
//    return this.currentUserSubject.value;
//  }
 
GetEmployee(){
  const user=sessionStorage.getItem('Employee');
   if (user) {
    const userObj = JSON.parse(user);
    this.User=userObj.res;}
}
// GetEmployeewithClaim(Empcode:string):Observable<any>{
// return this.http.get(`${this.baseurl}/${Empcode}`)
// }

createClaim(empCode: string, dto: any): Observable<any> {
  return this.http.post(
    `${this.claimUrl}/${empCode}/claim`,
    dto
  );
}

sendmail(empCode:string,claimId:string):Observable<any>{
     const params = new HttpParams()
      .set('Empcode', empCode)
      .set('ClaimId', claimId);
 return this.http.post(`${this.Mailurl}`, null, { params });


}}