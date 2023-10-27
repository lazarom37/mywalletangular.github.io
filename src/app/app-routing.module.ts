import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { AboutComponent } from './component/about/about.component';
import { EarningsComponent } from './component/earnings/earnings.component';
import { RecurringComponent } from './component/recurring/recurring.component';
import { ReportsComponent } from './component/reports/reports.component';

// const routes: Routes = [

//   {path:'', redirectTo: 'login', pathMatch: 'full'},
//   {path:'login', component: LoginComponent},
//   {path:'dashboard', component: DashboardComponent},
//   {path:'register', component: RegisterComponent},
// ];

const routes: Routes = [

  {path:'', redirectTo: 'dashboard', pathMatch: 'full'},
  {path:'login', component: LoginComponent},
  {path:'dashboard', component: DashboardComponent},
  {path:'register', component: RegisterComponent},

  {path:'about', component: AboutComponent},
  {path:'earnings', component: EarningsComponent},
  {path:'recurring', component: RecurringComponent},
  {path:'reports', component: ReportsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
