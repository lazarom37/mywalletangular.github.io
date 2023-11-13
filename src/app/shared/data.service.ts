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
  firestore: any;

  constructor(private afs: AngularFirestore, private authService: AuthService) { }

  //addEarningMoney
  addEarning(earning: EarningMoney) {
    const userId = this.authService.getUserId();
    if (userId) {
      earning.userId = userId; // Assign userId to earning
      return this.afs.collection('/EarningMoney').add(earning);
    } else {
      console.error('userId not available');
      return Promise.reject('userId not available'); // Return a rejected promise
    }
  }

  //addPayingMoney
  addPayingMoney(payingMoney: PayingMoney) {
    const userId = this.authService.getUserId();
    if (userId) {
      payingMoney.userId = userId; // Assign userId to payingMoney
      return this.afs.collection('/PayingMoney').add(payingMoney);
    } else {
      console.error('userId not available');
      return Promise.reject('userId not available'); // Return a rejected promise
    }
  }

  // //getAllEarningMoney
  // getAllEarningMoney() {
  //   return this.afs.collection('/EarningMoney').snapshotChanges();
  // }

  getAllEarningMoney() {
    const userId = this.authService.getUserId();
    if (userId) {
      return this.afs.collection('EarningMoney', ref => ref.where('userId', '==', userId)).snapshotChanges();
    } else {
      // handle case when userId is not available
      console.error('User not logged in');
      return; // Or handle this scenario appropriately
    }
  }

  //getAllPayingMoney
  getAllPayingMoney() {
    const userId = this.authService.getUserId();
    if (userId) {
      return this.afs.collection('PayingMoney', ref => ref.where('userId', '==', userId)).snapshotChanges();
    } else {
      // handle case when userId is not available
      console.error('User not logged in');
      return; // Or handle this scenario appropriately
    }
  }

  //deleteEarningMoney
  deleteEarningMoney(earningMoney: EarningMoney) {
  return this.afs.doc('/EarningMoney/'+ earningMoney.earningPaymentId).delete()
    .then(() => {
      console.log('Earning Money deleted successfully');
    })
    .catch(error => {
      console.error('Error deleting Earning Money:', error);
    });
  }

  //deletePayingMoney
  deletePayingMoney(payingMoney: PayingMoney) {
    return this.afs.doc('/PayingMoney/'+ payingMoney.payingMoneyId).delete()
        .catch(error => {
            console.error('Error deleting Paying Money:', error);
        });
    }
  

  //updateEarningMoney
  updateEarningMoney(earningMoney: EarningMoney) {
    const docId = earningMoney.earningPaymentId;
    if (docId) {
      return this.afs.doc(`EarningMoney/${docId}`).update(earningMoney);
    } else {
      console.error('docId not available');
      return Promise.reject('docId not available'); // Return a rejected promise
    }
  }
  

    //updatePayingMoney
    updatePayingMoney(payingMoney: PayingMoney) {
      const docId = payingMoney.payingMoneyId;
      if (docId) {
        return this.afs.doc(`PayingMoney/${docId}`).update(payingMoney);
      } else {
        console.error('docId not available');
        return Promise.reject('docId not available'); // Return a rejected promise
      }
    }
}




