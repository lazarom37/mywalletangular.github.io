import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { ForgotpasswordComponent } from './component/forgotpassword/forgotpassword.component';
import { VerifyemailComponent } from './component/verifyemail/verifyemail.component';

const routes: Routes = [

  {path:'', redirectTo: 'login', pathMatch: 'full'},
  {path:'login', component: LoginComponent},
  {path:'dashboard', component: DashboardComponent},
  {path:'register', component: RegisterComponent},
  {path:'forgotpassword', component: ForgotpasswordComponent},
  {path:'verifyemail', component: VerifyemailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
