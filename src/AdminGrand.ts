import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AdminGuard  {

  constructor(private router: Router) {}

  canActivate(): boolean {

     const user = localStorage.getItem('role') ;
    if (user) {
      const userObj = JSON.parse(user);
  if( userObj === 'Admin'){
    return true;}
   // Check if user is admin

    }

    this.router.navigate(['/home']);
    return false;
  }
}