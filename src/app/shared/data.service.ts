import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { EarningMoney } from '../model/earning-money';
import { PayingMoney} from '../model/paying-money';
import { AuthService } from './auth.service';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private afs: AngularFirestore, private authService: AuthService, private auth : AngularFireAuth) { }

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
  getEarnings() {
    const userId = this.authService.getUserId();
    return this.auth.user.pipe(
      switchMap(user => {
        return this.afs
          .collection('earnings', ref => ref.where('userId', '==', user?.uid))
          .snapshotChanges();
      })
    );
  }
  //getAllEarningMoney
  getAllEarningMoney() {
    const userId = this.authService.getUserId();
    if (userId) {
      return this.afs.collection('newEarningMoney', ref => ref.where('userId', '==', userId)).snapshotChanges();
    } else {
      // handle case when userId is not available
      console.error('User not logged in');
      return Promise.reject('userId not available'); // Or handle this scenario appropriately
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

// import { Injectable } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { EarningMoney } from '../model/earning-money';
// import { PayingMoney} from '../model/paying-money';
// import { AuthService } from './auth.service';
// import { AngularFireAuthModule } from '@angular/fire/compat/auth';


// @Injectable({
//   providedIn: 'root'
// })
// export class DataService {
//   firestore: any;

//   constructor(private afs: AngularFirestore, private authService: AuthService) { }

//   //addEarningMoney
//   addEarning(earning: EarningMoney) {
//     const userId = this.authService.getUserId();
//     if (userId) {
//       earning.userId = userId; // Assign userId to earning
//       return this.afs.collection('/newEarningMoney').add(earning);
//     } else {
//       console.error('userId not available');
//       return Promise.reject('userId not available'); // Return a rejected promise
//     }
//   }



//   // //getAllEarningMoney
//   // getAllEarningMoney() {
//   //   return this.afs.collection('/EarningMoney').snapshotChanges();
//   // }

//   getAllEarningMoney() {
//     const userId = this.authService.getUserId();
//     if (userId) {
//       return this.afs.collection('newEarningMoney', ref => ref.where('userId', '==', userId)).snapshotChanges();
//     } else {
//       // handle case when userId is not available
//       console.error('User not logged in');
//       return; // Or handle this scenario appropriately
//     }
//   }

//   //getAllPayingMoney
//   getAllPayingMoney() {
//     const userId = this.authService.getUserId();
//     if (userId) {
//       return this.afs.collection('newPayingMoney', ref => ref.where('userId', '==', userId)).snapshotChanges();
//     } else {
//       // handle case when userId is not available
//       console.error('User not logged in');
//       return; // Or handle this scenario appropriately
//     }
//   }

//   //deleteEarningMoney
//   deleteEarningMoney(earningMoney: EarningMoney) {
//   return this.afs.doc('/newEarningMoney/'+ earningMoney.earningPaymentId).delete()
//     .then(() => {
//       console.log('Earning Money deleted successfully');
//     })
//     .catch(error => {
//       console.error('Error deleting Earning Money:', error);
//     });
//   }


  

//   //updateEarningMoney
//   updateEarningMoney(earningMoney: EarningMoney) {
//     const docId = earningMoney.earningPaymentId;
//     if (docId) {
//       return this.afs.doc(`newEarningMoney/${docId}`).update(earningMoney);
//     } else {
//       console.error('docId not available');
//       return Promise.reject('docId not available'); // Return a rejected promise
//     }
//   }
  
// }






