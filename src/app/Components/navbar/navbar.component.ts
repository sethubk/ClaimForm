import { Component } from '@angular/core';
import { ApiService } from '../../Services/Api Services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
 user: any;
  showDropdown = false;

  constructor(
    private authService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
 const userString = sessionStorage.getItem("User");
  
 if (userString) {
    const userObj = JSON.parse(userString);   // convert string → object
console.log("userdasdas",userObj)
    this.user = userObj.res.name;  // or userObj.name depending on your response
  }
//  const Users=this.authService.User
//     this.user=Users.res;
//     console.log(this.user);

  }
  
goHome() {
  this.router.navigate(['/HomePage']);
}


  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  logout() {

    // // 🔥 Clear everything
    localStorage.clear();
    sessionStorage.clear();

    // //this.authService.logout();

    // // 🔥 Redirect to login
    this.router.navigate(['/']);
  }


}
