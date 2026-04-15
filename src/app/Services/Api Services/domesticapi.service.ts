import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DomesticExpense } from '../../Components/Models/claimmodels';

@Injectable({
  providedIn: 'root'
})
export class DomesticapiService {

  constructor(private http:HttpClient) { }
private readonly Domestic = 'https://localhost:7283/api/DomesticExpense';
  createExpense(ClaimId: string, payload: any): Observable<DomesticExpense> {
      return this.http.post<DomesticExpense>(
        `${this.Domestic}/${ClaimId}/DomesticExpense`,
        payload
      );}}  

