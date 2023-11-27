import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
import { EarningMoney } from '../../model/earning-money';
import { PayingMoney } from '../../model/paying-money';
import { UserProfile } from '../../model/user-profile';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PayingTableEntry } from 'src/app/model/paying-table-entry';
import { BalanceUpdateService } from './balance-update.service';


@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit {
  currentBalance: number = 0;
  
  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.fetchDataAndCalculateBalance();
  }

  fetchDataAndCalculateBalance(): void {
    // Fetch data from Firebase and then call calculateBalance
    // Example:
    this.firestore.collection('earnings').valueChanges()
      .subscribe(earnings => {
        // Assume you fetch payments the same way
        this.firestore.collection('payments').valueChanges()
          .subscribe(payments => {
            this.calculateBalance(earnings, payments);
          });
      });
  }

  calculateBalance(earnings: any[], payments: any[]): void {
    this.currentBalance = 0;
    earnings.forEach(earning => {
      this.currentBalance += earning.earningPaymentAmount;
    });
    payments.forEach(payment => {
      this.currentBalance -= payment.payingPaymentAmount;
    });
  }
}