import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EarningTableEntry } from '../model/earning-table-entry';
import { PayingTableEntry } from '../model/paying-table-entry';
import { RecurrenceType } from '../model/recurrence';

@Injectable({
  providedIn: 'root'
})
export class FinancesService {
  private earningsSource = new BehaviorSubject<number>(0);
  private paymentsSource = new BehaviorSubject<number>(0);

  totalEarnings$ = this.earningsSource.asObservable();
  totalPayments$ = this.paymentsSource.asObservable();

  updateEarnings(total: number) {
    this.earningsSource.next(total);
  }

  updatePayments(total: number) {
    this.paymentsSource.next(total);
  }

  computeBalance(earnings: Array<EarningTableEntry>, payments: Array<PayingTableEntry>, when: Date): number {
    let balance = 0;
    earnings.forEach(earning => {
      balance += this.computeEarning(earning, when);
    });
    payments.forEach(payment => {
      balance -= this.computePaying(payment, when);
    })
    return balance;
  }

  computeEarning(earning: EarningTableEntry, when: Date): number {
    switch (earning.recurrence.recurrenceType) {
      case RecurrenceType.OneOff:
        if (earning.recurrence.beginDate.getTime() <= when.getTime()) {
          return earning.amount;
        }
    }
    return 0;
  }

  computePaying(paying: PayingTableEntry, when: Date): number {
    switch (paying.recurrence.recurrenceType) {
      case RecurrenceType.OneOff:
        if (paying.recurrence.beginDate.getTime() <= when.getTime()) {
          return paying.amount;
        }
    }
    return 0;
  }
}



