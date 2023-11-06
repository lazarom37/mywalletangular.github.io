import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
import{MatDialog, MatDialogConfig} from '@angular/material/dialog';

import { PayingMoney } from 'src/app/model/paying-money';  
import { EarningMoney } from 'src/app/model/earning-money';
import { DataService } from 'src/app/shared/data.service';
import { PaymentsAndEarningComponent } from '../payments_and_earnings/payments_and_earnings.component';

@Component({
  selector: 'app-recurring-payments-and-earnings',
  templateUrl: './recurring_payments_and_earnings.html',
  styleUrls: ['./recurring_payments_and_earnings.css']
})
export class RecurringPaymentsAndEarningsComponent implements OnInit {

  
  userEarningDescArrays: string[] = [];
  userPayingDescArrays: string[] = [];

  earningMoneyList: EarningMoney[] = [];

  earningMoneyObj: EarningMoney = {
    earningPaymentId: '',
    earningPaymentDesc: '',
    earningPaymentAmount: 0
  };
  earningPaymentId: string = '';
  earningPaymentDesc: string= '';
  earningPaymentAmount: number= 0;

  payingMoneyList: PayingMoney[] = [];

  payingMoneyObj: PayingMoney = {
    payingMoneyId: '',
    payingMoneyDesc: '',
    payingMoneyAmount: 0
  };
  payingMoneyId: string = '';
  payingMoneyDesc: string= '';
  payingMoneyAmount: number= 0;
  
  constructor(private auth: AuthService, private router : Router, private dialogRef: MatDialog, private data: DataService) { }

  ngOnInit(): void {
    this.getAllEarningMoney();
    this.getAllPayingMoney();
  }

  

  getAllEarningMoney() {
    this.data.getAllEarningMoney().subscribe(res => {

      this.earningMoneyList = res.map((e : any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        return data; 
      })
    }, err => { 
      alert("An error occured while fetching earning money data");
    });
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

    this.data.addEarningMoney(this.earningMoneyObj);
    this.userEarningDescArrays.push(this.earningPaymentDesc); // Add the description to the earning descriptions array
    this.resetForm();
  }

  updateEarningMoney() {
  }

  deleteEarningMoney(earningMoney: EarningMoney) {
    if (window.confirm('Are sure you want to delete '+ earningMoney.earningPaymentAmount+' from MyWallet?')) {
      this.data.deleteEarningMoney(earningMoney);
    }

  }

  getAllPayingMoney() {
    this.data.getAllPayingMoney().subscribe(res => {

      this.payingMoneyList = res.map((e : any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        return data; 
      })
    }, err => { 
      alert("An error occured while fetching earning money data");
    });


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
    this.userPayingDescArrays.push(this.payingMoneyDesc); // Add the description to the paying descriptions array
    this.resetForm();
  }

  updatePayingMoney() {

  }

  deletePayingMoney(payingMoney: PayingMoney) {
    if (window.confirm('Are sure you want to delete '+ payingMoney.payingMoneyAmount+' from MyWallet?')) {
      this.data.deletePayingMoney(payingMoney);
    }
  }


}


