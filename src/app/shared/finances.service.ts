import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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

  // totalPayments: number = 0;
  // totalEarnings: number = 0;
}



