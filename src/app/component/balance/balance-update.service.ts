import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BalanceUpdateService {
  private balanceUpdateSource = new BehaviorSubject<void>(undefined);

  balanceUpdate$ = this.balanceUpdateSource.asObservable();

  notifyBalanceUpdate() {
    this.balanceUpdateSource.next();
  }
}

