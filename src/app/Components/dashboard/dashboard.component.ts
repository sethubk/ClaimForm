import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { ChartOptions } from 'chart.js';
import { Chart } from 'chart.js/dist';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { ChartData, ChartType } from 'chart.js';
import { FormsModule } from '@angular/forms';
import 'chart.js/auto';

import { Claims } from '../homepage/homepage.component';
import { ClaimApiService } from '../../Services/Api Services/claim-api.service';
import { ApiService } from '../../Services/Api Services/api.service';
import { status } from '../Enum';
import { ToasterService } from '../../Services/toaster.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ClarityModule, CommonModule, FormsModule, NgChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private ClaimApi:ClaimApiService,
    private api: ApiService,
  private toaster:ToasterService,
private router:Router) { }
  dataSource: any[] = [];
  allClaims: Claims[] = [];
  filteredData: any[] = [];
  selectedExpenses: any[] = [];
  Empcode: string = '';
  // KPI
  totalClaims = 0;
  totalAmount = 0;
  approvedCount = 0;
  pendingCount = 0;
rejectedCount=0;
  selectedType = '';
  selectedStatus = '';

  // Charts
  pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: []
  };

  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    
    // 🔥 Replace with API
    this.Empcode = this.api.User.employeeCode;
  
    this.getclaim()
   
    
  }
  
//   getclaim() {
//     this.api.GetEmployeewithClaim(this.Empcode).subscribe(res => {

      
//    this.dataSource=(res as any).recentClaims;
//  this.dataSource = this.dataSource.filter(c => c.status !== 'Draft' && c.amount!>0 );

//       // Use a fresh copy for the grid
//         this.filteredData = this.dataSource;

        
//     this.calculateKPIs();
//     this.prepareCharts();
//     });
//   }

 getclaim(): void {
  this.toaster.showLoader()
    this.ClaimApi.getClaimByEmpCode(this.Empcode)
      .subscribe({
        next: (res: Claims[]) => {
          console.log('Claims fetched:', res);

          this.allClaims = res.filter(
            c => c.status !== 'Draft'
          );
          
          this.dataSource = [...this.allClaims];
          this.filteredData = [...this.allClaims];
          this.calculateKPIs();
          this.prepareCharts();
           console.log("Claims fetched:", this.dataSource);
           this.toaster.hideLoader()
        },
        error: (err) => {
          console.error('Error fetching claims:', err);
         
        }
      });
  }
  calculateKPIs() {
    this.totalClaims = this.filteredData.length;
    this.totalAmount = this.filteredData.reduce((a, b) => a + b.amount, 0);
    this.approvedCount = this.filteredData.filter(x => x.status === status.Approved).length;
    this.pendingCount = this.filteredData.filter(x => x.status === status.pending).length;
    this.rejectedCount=this.filteredData.filter(x=>x.status===status.Rejected).length
  }

  
prepareCharts() {
  const typeMap: Record<string, number> = {};

  this.filteredData.forEach(c => {
    typeMap[c.type] = (typeMap[c.type] || 0) + (c.amount ?? 0);
  });

  // PIE
  this.pieChartData = {
    labels: Object.keys(typeMap),
    datasets: [{ data: Object.values(typeMap) }]
  };

  // BAR
  this.barChartData = {
    labels: Object.keys(typeMap),
    datasets: [{
      data: Object.values(typeMap),
      label: 'Expense by Type'
    }]
  };
}

  applyFilters() {
    this.filteredData = this.dataSource.filter(x =>
      (!this.selectedType || x.type === this.selectedType) &&
      (!this.selectedStatus || x.status === this.selectedStatus)
    );

    this.calculateKPIs();
    this.prepareCharts();
  }

  onPieClick(event: any) {
    const index = event.active?.[0]?.index;
    if (index !== undefined) {
      const type = this.pieChartData.labels?.[index] as string;
      this.selectedType = type;
      this.applyFilters();

      this.selectedExpenses = this.filteredData.flatMap(x => x.expenses);
    }
  }

  getStatusClass(status: string) {
    return {
      'status-approved': status === 'Approved',
      'status-pending': status === 'Pending',
      'status-rejected': status === 'Rejected',
      'status-Withdrawn':status==='WithDrawn'
    };
  }
backbtn() {
    this.router.navigate(['/Homepage'])
  }
  
}
