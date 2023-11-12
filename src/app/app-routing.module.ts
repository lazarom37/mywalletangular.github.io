import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { PaymentsAndEarningComponent } from './component/payments_and_earnings/payments_and_earnings.component';
import { AboutComponent } from './component/about/about.component';
// import { RecurringPaymentsAndEarningsComponent } from './component/recurring_payments_and_earnings/recurring_payments_and_earnings.component';
import { ReportsComponent } from './component/reports/reports.component'
import { ForgotpasswordComponent } from './component/forgotpassword/forgotpassword.component';
import { VerifyemailComponent } from './component/verifyemail/verifyemail.component';
import { ProfileComponent } from './component/profile/profile.component';
import { LogoutComponent } from './component/logout/logout.component';

const routes: Routes = [

  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'payments_earnings', component: PaymentsAndEarningComponent},
  // {path: 'recurrent_payments_earnings', component: RecurringPaymentsAndEarningsComponent},
  {path: 'reports', component: ReportsComponent},
  {path: 'about', component: AboutComponent},
  {path: 'forgotpassword', component: ForgotpasswordComponent},
  {path: 'verifyemail', component: VerifyemailComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'logout', component: LogoutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
