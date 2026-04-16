import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ApiService } from './Services/Api Services/api.service';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { ClrVerticalNavModule } from "@clr/angular";
import { ToastComponent } from './Components/toast/toast.component';
import { BillPreviewComponent } from "./Components/bill-preview/bill-preview.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule, SidebarComponent, ClrVerticalNavModule, ToastComponent, BillPreviewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ClaimForm';
  user:string='';
  constructor(public authService: ApiService,public router:Router) {

   
  }
}
