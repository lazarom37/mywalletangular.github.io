import { Component, OnInit } from '@angular/core';
import{MatDialog, MatDialogConfig} from '@angular/material/dialog';


import { PayingMoney } from 'src/app/model/paying-money';  
import { EarningMoney } from 'src/app/model/earning-money';
import { DataService } from 'src/app/shared/data.service';

import { ElementRef, AfterViewInit, ViewChild } from '@angular/core';

import {AngularFireStorage} from '@angular/fire/compat/storage';
import {AngularFirestore} from '@angular/fire/compat/firestore'

@Component({
  selector: 'app-payments-and-earnings',
  templateUrl: './payments_and_earnings.component.html',
  styleUrls: ['./payments_and_earnings.component.css']
  
})

export class PaymentsAndEarningComponent implements OnInit {

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
  
  constructor(private data: DataService , private dialogRef: MatDialog) { }

  

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
    this.userPayingDescArrays.push(this.earningMoneyObj.earningPaymentDesc); 
    // this.userEarningDescArrays.push(this.earningPaymentDesc); 
    this.resetForm();
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


}

