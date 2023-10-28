import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { PaymentsAndEarningComponent } from './component/payments_and_earnings/payments_and_earnings.component';
import { AboutComponent } from './component/about/about.component';
import { RecurringPaymentsAndEarningsComponent } from './component/recurring_payments_and_earnings/recurring_payments_and_earnings.component';
import { ReportsComponent } from './component/reports/reports.component'

const routes: Routes = [

  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'payments_earnings', component: PaymentsAndEarningComponent},
  {path: 'recurrent_payments_earnings', component: RecurringPaymentsAndEarningsComponent},
  {path: 'reports', component: ReportsComponent},
  {path: 'about', component: AboutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
