import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { EarningMoney } from '../model/earning-money';

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

  //getAllEarningMoney
  getAllEarningMoney() {
    return this.afs.collection('/EarningMoney').snapshotChanges();
  }

  //deleteEarningMoney
  deleteEarningMoney(earningMoney: EarningMoney) {
    return this.afs.doc('/EarningMoney/'+ earningMoney.earningPaymentId).delete();
  }

  //updateEarningMoney
  updateEarningMoney(earningMoney: EarningMoney) {
    this.deleteEarningMoney(earningMoney);
    this.addEarningMoney(earningMoney);
  }
}
