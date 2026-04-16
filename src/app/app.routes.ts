import { Routes } from '@angular/router';
import { LoginPageComponent } from './Components/login-page/login-page.component';
import { HomepageComponent } from './Components/homepage/homepage.component';
import { ExpenseComponent } from './Components/Expense/expense/expense.component';
import { ExpensereviewComponent } from './Components/Expense/expensereview/expensereview.component';
import { InternationalComponent } from './Components/International/international/international.component';
import { InternationalCalculationalComponent } from './Components/International/international-calculational/international-calculational.component';
import { InternationalReviewComponent } from './Components/International/international-review/international-review.component';
import { ClaimViewComponent } from './Components/claim-view/claim-view.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { ReimbursementComponent } from './Components/reimbursement/reimbursement.component';
import { AdminGuard } from '../AdminGrand';
import { ReimbursementClaimComponent } from './Components/reimbursement-claim/reimbursement-claim.component';
import { DomesticComponent } from './Components/Domestic/domestic/domestic.component';
import { DomesticCalculationComponent } from './Components/Domestic/domestic-calculation/domestic-calculation.component';
import { DomesticReviewComponent } from './Components/Domestic/domestic-review/domestic-review.component';

export const routes: Routes = [

    {path:"",component:LoginPageComponent},
    {path:"Homepage",component:HomepageComponent},
    {path:"Expense",component:ExpenseComponent},
     {path:'expensereview',component:ExpensereviewComponent},
     {path:'dashboard',component:DashboardComponent},
     {path:'international',component:InternationalComponent},
     {path:'internationalreview',component:InternationalReviewComponent},
{path:'internationalcal',component:InternationalCalculationalComponent},
{path:'claim-view/:claimId',component:ClaimViewComponent},

{path:'reimbursement',component:ReimbursementComponent,canActivate: [AdminGuard]
} ,
{path:'reimbursement/:claimId',component:ReimbursementClaimComponent,canActivate: [AdminGuard]},
{path:'domestic',component:DomesticComponent},
{path:'domesticexpense',component:DomesticCalculationComponent},
{path:'domesticreview',component:DomesticReviewComponent},
{path:'Expense/:claimId',component:ExpenseComponent},
{path:'InternationalTravels/:claimId',component:InternationalComponent},
{path:'DomesticTravels/:claimId',component:DomesticComponent}
];
