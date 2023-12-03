import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { EarningMoney } from '../model/earning-money';
import { PayingMoney} from '../model/paying-money';
import { AuthService } from './auth.service';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private afs: AngularFirestore, private authService: AuthService) { }

  //addEarningMoney
  addEarning(earning: EarningMoney) {
    const userId = this.authService.getUserId();
    if (userId) {
      earning.userId = userId; // Assign userId to earning
      return this.afs.collection('/newEarningMoney').add(earning);
    } else {
      console.error('userId not available');
      return Promise.reject('userId not available'); // Return a rejected promise
    }
  }

  //getAllEarningMoney
  getAllEarningMoney() {
    const userId = this.authService.getUserId();
    if (userId) {
      return this.afs.collection('newEarningMoney', ref => ref.where('userId', '==', userId)).snapshotChanges();
    } else {
      // handle case when userId is not available
      console.error('User not logged in');
      return; // Or handle this scenario appropriately
    }
  }

  //deleteEarningMoney
  deleteEarningMoney(earningMoney: EarningMoney) {
    return this.afs.doc('/newEarningMoney/'+ earningMoney.earningPaymentId).delete();
  }

  //updateEarningMoney
  updateEarningMoney(earningMoney: EarningMoney) {
    this.deleteEarningMoney(earningMoney);
    this.addEarning(earningMoney);
  }
}
