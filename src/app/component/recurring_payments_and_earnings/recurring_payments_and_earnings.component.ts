import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-recurring-payments-and-earnings',
  templateUrl: './recurring_payments_and_earnings.html',
  styleUrls: ['./recurring_payments_and_earnings.css']
})
export class RecurringPaymentsAndEarningsComponent implements OnInit {

  constructor(private auth: AuthService, private router : Router) { }

  ngOnInit(): void {
    if (!this.auth.checkUserLogin()) {
      this.router.navigate(['login']);
    }
  }


}
