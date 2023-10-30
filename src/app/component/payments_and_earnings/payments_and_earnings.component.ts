import { Component, OnInit } from '@angular/core';

import { Payment } from 'src/app/component/payments_and_earnings/payment';
import { EarningMoney } from 'src/app/model/earning-money';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-payments-and-earnings',
  templateUrl: './payments_and_earnings.component.html',
  styleUrls: ['./payments_and_earnings.component.css']
})
export class PaymentsAndEarningComponent implements OnInit {

  earningMoneyList: EarningMoney[] = [];

  earningMoneyObj: EarningMoney = {
    earningPaymentId: '',
    earningPaymentDesc: '',
    earningPaymentAmount: 0
  };
  earningPaymentId: string = '';
  earningPaymentDesc: string= '';
  earningPaymentAmount: number= 0;
  
  constructor(private data: DataService ) { }

  ngOnInit(): void {
    this.getAllEarningMoney();
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
    this.resetForm();
  }

  updateEarningMoney() {

  }

  deleteEarningMoney(earningMoney: EarningMoney) {
    if (window.confirm('Are sure you want to delete '+ earningMoney.earningPaymentAmount+' from MyWallet?')) {
      this.data.deleteEarningMoney(earningMoney);
    }

  }


}

