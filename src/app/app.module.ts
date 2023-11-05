import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { ForgotpasswordComponent } from './component/forgotpassword/forgotpassword.component';
import { VerifyemailComponent } from './component/verifyemail/verifyemail.component';
import { AboutComponent } from './component/about/about.component';
import { ReportsComponent } from './component/reports/reports.component';
import { PaymentsAndEarningComponent } from './component/payments_and_earnings/payments_and_earnings.component';
import { RecurringPaymentsAndEarningsComponent } from './component/recurring_payments_and_earnings/recurring_payments_and_earnings.component';
import { ProfileComponent } from './component/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    ForgotpasswordComponent,
    VerifyemailComponent,
    PaymentsAndEarningComponent,
    RecurringPaymentsAndEarningsComponent,
    ReportsComponent,
    AboutComponent,
    ProfileComponent
  ],
  imports: [
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
