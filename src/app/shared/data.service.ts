import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { EarningMoney } from '../model/earning-money';
import { PayingMoney} from '../model/paying-money';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private afs: AngularFirestore) { }

  //addEarningMoney
  addEarningMoney(earningMoney: EarningMoney) {
    earningMoney.earningPaymentId = this.afs.createId();
    return this.afs.collection('/EarningMoney').add(earningMoney);
  }

  //addPayingMoney
  addPayingMoney(payingMoney: PayingMoney) {
    payingMoney.payingMoneyId = this.afs.createId();
    return this.afs.collection('/PayingMoney').add(payingMoney);
  }

  //getAllEarningMoney
  getAllEarningMoney() {
    return this.afs.collection('/EarningMoney').snapshotChanges();
  }

  //getAllPayingMoney
  getAllPayingMoney() {
    return this.afs.collection('/PayingMoney').snapshotChanges();
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
    this.deleteEarningMoney(earningMoney);
    this.addEarningMoney(earningMoney);
  }

    //updatePayingMoney
    updatePayingMoney(payingMoney: PayingMoney) {
      this.deletePayingMoney(payingMoney);
      this.addPayingMoney(payingMoney);
    }
}

