import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
import { EarningMoney } from '../../model/earning-money';
import { PayingMoney } from '../../model/paying-money';
import { UserProfile } from '../../model/user-profile';


@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  // Beginning of mock data. You would replace this with relevant Firebase code
  // Expected result given this data: -8000
  currentBalance: number = 0;
  mockArray = [
    {
      earningPaymentId: 0,
      earningPaymentDesc: "mockEarning",
      earningPaymentAmount: 1000
    }
    ,
    {
      payingPaymentId: 0,
      payingPaymentDesc: "mockPaying",
      payingPaymentAmount: 9000
    }
  ];

  calculateBalance(): void {
    this.currentBalance = 0;
    this.mockArray.forEach(item => {
      if (item.earningPaymentDesc != null) { //Verifies if item is classified as an earning. There's probably a better way of doing this
        this.currentBalance += item.earningPaymentAmount;
      } else if (item.payingPaymentDesc != null) { //The same but for payments
        this.currentBalance -= item.payingPaymentAmount;
      }
    });
  }
}