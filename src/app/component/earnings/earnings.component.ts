// Combined imports from both files
import { Component, OnInit, Inject, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { DataService } from 'src/app/shared/data.service';
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialogConfig } from '@angular/material/dialog';
import { Recurrence, RecurrenceType } from 'src/app/model/recurrence';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EarningTableEntry} from 'src/app/model/earning-table-entry';
import { EarningMoney }from 'src/app/model/earning-money';
import { PayingMoney } from 'src/app/model/paying-money';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';

export interface MatGridListTile {
  cols: number;
  cssClass: string;
  content: string;
}

function recurrenceToString(rec: Recurrence): string {
  if (rec.recurrenceType == RecurrenceType.OneOff) {
    return "One off on " + rec.beginDate.toLocaleDateString();
  }
  if (rec.recurrenceType == RecurrenceType.Daily) {
    return "Daily from " + rec.beginDate.toLocaleDateString();
  }
  if (rec.recurrenceType == RecurrenceType.Weekly) {
    return "Weekly from " + rec.beginDate.toLocaleDateString();
  }
  if (rec.recurrenceType == RecurrenceType.Monthly) {
    return "Monthly from " + rec.beginDate.toLocaleDateString();
  }
  if (rec.recurrenceType == RecurrenceType.Annually) {
    return "Annualy from " + rec.beginDate.toLocaleDateString();
  }
  return "Unknown";
}

// Merged component
@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.html',
  styleUrls: ['./earnings.css']
})
export class EarningsComponent implements OnInit {

  earnings: Array<EarningTableEntry> = new Array();
  tiles: Array<MatGridListTile> = new Array();

  userEarningDescArrays: string[] = [];
  userPayingDescArrays: string[] = [];
  earningMoneyList: EarningMoney[] = [];


  earningMoneyObj: EarningMoney = {
    userId : '',
    earningPaymentId: '',
    earningPaymentDesc: '',
    earningPaymentAmount: 0
  };

  userId : string = '';
  earningPaymentId: string = '';
  earningPaymentDesc: string= '';
  earningPaymentAmount: number= 0;

  payingMoneyList: PayingMoney[] = [];

  payingMoneyObj: PayingMoney = {
    userId : '',
    payingMoneyId: '',
    payingMoneyDesc: '',
    payingMoneyAmount: 0
  };
  userIdtwo : string = '';
  payingMoneyId: string = '';
  payingMoneyDesc: string= '';
  payingMoneyAmount: number= 0;

  constructor(
    private auth: AuthService,
    private data: DataService,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    if (!this.auth.checkUserLogin()) {
      this.router.navigate(['login']);
    }

    this.getAllEarningMoney();
    this.getAllPayingMoney();
    
    this.earnings.push({name: "Found money 1", amount: 1000, recurrence: {recurrenceType: RecurrenceType.OneOff, beginDate: new Date("2023-11-08 10:00:00")}});
    this.earnings.push({name: "Found money 2", amount: 100, recurrence: {recurrenceType: RecurrenceType.Daily, beginDate: new Date("2023-11-09 10:00:00")}});
    this.earnings.push({name: "Found money 3", amount: 300, recurrence: {recurrenceType: RecurrenceType.Weekly, beginDate: new Date("2023-11-10 10:00:00")}});
    this.earnings.push({name: "Found money 4", amount: 2000, recurrence: {recurrenceType: RecurrenceType.Monthly, beginDate: new Date("2023-11-11 10:00:00")}});
    this.earnings.push({name: "Found money 5", amount: 500, recurrence: {recurrenceType: RecurrenceType.Annually, beginDate: new Date("2023-11-12 10:00:00")}});
    this.updateMatGridList();
  }

  getAllEarningMoney() {
    if (this.data) {
      this.data.getAllEarningMoney()?.subscribe(res => {
        this.earningMoneyList = res.map(e => {
        const data = e.payload.doc.data() as EarningMoney;
        return data;
        });
      }, err => { 
        console.log("An error occured while fetching earning money data");
      }
      );
    }
  }
  

  resetForm() {
    this.earningPaymentId = '',
    this.earningPaymentDesc = '',
    this.earningPaymentAmount = 0
  }

  addEarningMoney() {
    if(this.earningPaymentAmount <= 0 || this.earningPaymentDesc == '') {
      alert("Please fill all the values before clicking on the Add Earning button");
      return;
    }

    this.earningMoneyObj.earningPaymentId= '';
    this.earningMoneyObj.earningPaymentDesc= this.earningPaymentDesc;
    this.earningMoneyObj.earningPaymentAmount= this.earningPaymentAmount; 

    this.userPayingDescArrays.push(this.earningMoneyObj.earningPaymentDesc); 
    // this.userEarningDescArrays.push(this.earningPaymentDesc); 
    this.resetForm();

    this.data.addEarning(this.earningMoneyObj)
  
  }

  updateEarningMoney(earningMoney : EarningMoney) {
    this.deleteEarningMoney(earningMoney);
    // this.addEarningMoney(earningMoney);
  }


  // deleteEarningMoney(earningMoney: EarningMoney) {
  //   if (window.confirm('Are sure you want to delete '+ earningMoney.earningPaymentAmount+' from MyWallet?')) {
  //     this.data.deleteEarningMoney(earningMoney);
  //   }

  // }

  deleteEarningMoney(earningMoney: EarningMoney) {
    if (window.confirm('Are sure you want to delete ' + earningMoney.earningPaymentAmount+' from MyWallet?')) {
      this.data.deleteEarningMoney(earningMoney)
      
      .then(() => {
        console.log('Earning Money deleted successfully 2');
      })
      .catch(error => {
        console.error('Error deleting Earning Money 2:', error);
      });
    }
  }

  getAllPayingMoney() {
    if (this.data) {
      this.data.getAllPayingMoney()?.subscribe(res => {
        this.payingMoneyList = res.map(e => {
        const data = e.payload.doc.data() as PayingMoney;
        return data;
        });
      }, err => { 
        console.log("An error occured while fetching paying money data");
      }
      );
    }
  }

  resetFormPayment() {
    this.payingMoneyId = '',
    this.payingMoneyDesc = '',
    this.payingMoneyAmount = 0

  }

  addPayingMoney() {
    if(this.payingMoneyAmount <= 0 || this.payingMoneyDesc == '') {
      alert("Please fill all the values before clicking on the Add Payment button");
      return;
    }

    this.payingMoneyObj.payingMoneyId= '';
    this.payingMoneyObj.payingMoneyDesc= this.payingMoneyDesc;
    this.payingMoneyObj.payingMoneyAmount= this.payingMoneyAmount; 

    this.data.addPayingMoney(this.payingMoneyObj);
    // this.userPayingDescArrays.push(this.payingMoneyDesc); 
    this.userPayingDescArrays.push(this.payingMoneyObj.payingMoneyDesc); 
    this.resetForm();
  }


  deletePayingMoney(payingMoney: PayingMoney) {
    if (window.confirm('Are sure you want to delete '+ payingMoney.payingMoneyAmount+' from MyWallet?')) {
      this.data.deletePayingMoney(payingMoney);
      this.ngOnInit();
    }
  }

  updatePayingMoney(payingMoney : PayingMoney) {
    this.deletePayingMoney(payingMoney);
    // this.addPayingMoney(payingMoney);
  }


  // Combine methods from both components
  // Ensure to merge the logic and adjust as necessary

  updateMatGridList(): void {
    this.tiles = new Array();
    this.tiles.push({cols: 10, cssClass: "list_header", content: "Name"});
    this.tiles.push({cols: 10, cssClass: "list_header", content: "Amount"});
    this.tiles.push({cols: 20, cssClass: "list_header", content: "When"});
    for (var i = 0; i < this.earnings.length; ++i) {
      var styleName;
      if (i % 2 == 0) {
        styleName = "even_list_line";
      } else {
        styleName = "odd_list_line";
      }
      var earning = this.earnings[i];
      this.tiles.push({cols: 10, cssClass: styleName, content: earning.name});
      this.tiles.push({cols: 10, cssClass: styleName, content: "$" + earning.amount});
      this.tiles.push({cols: 20, cssClass: styleName, content: recurrenceToString(earning.recurrence)});   
    }
  }

  // Add other methods from earnings.component.ts and earnings_and_payments.ts
  // Remember to handle any overlaps or conflicts in logic

  // Add modal component if required
  onAddNewEarning(): void {
    const modalWindow = this.dialog.open(AddEarningModal, {
      data: { name: "booo", amount: 0 },
      height: "400px",
      width: "600px",
    });
    modalWindow.afterClosed().subscribe(result => {
      console.log(JSON.stringify(result));
    });
  }

  earningsOne: Array<EarningTableEntry> = new Array();
  tilesOne: Array<MatGridListTile> = new Array();
}


// If you're using the AddEarningModal, include it here
// Adjust the imports and constructor as necessary
export interface AddEarningModalData {
  name: string;
  amount: number;
  recurrence: string;
  beginDate: string;
};

@Component({
  selector: 'modal-add-earning',
  templateUrl: './modalAddEarning.html',
  styleUrls: ['./modalAddEarning.css'],
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
})
export class AddEarningModal {

  constructor(
    public dialogRef: MatDialogRef<AddEarningModal>,
    @Inject(MAT_DIALOG_DATA) public data: AddEarningModalData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}



// Add any additional helper functions or interfaces
