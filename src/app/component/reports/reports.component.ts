import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import Chart from 'chart.js/auto';
import { EarningTableEntry } from 'src/app/model/earning-table-entry';
import { PayingTableEntry } from 'src/app/model/paying-table-entry';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  chart?: Chart;
  reportType: string = '0';
  year: string = '2023';
  yearMonth: string = '2023-01';

  annualEarnings: Map<string, Array<number>> = new Map();
  annualSpendings: Map<string, Array<number>> = new Map();

  monthlyEarnings: Map<string, Array<number>> = new Map();
  monthlySpendings: Map<string, Array<number>> = new Map();

  constructor(private auth: AuthService, private router : Router, private firestore: AngularFirestore) { }

  ngOnInit(): void {
    if (!this.auth.checkUserLogin()) {
      this.router.navigate(['login']);
    }
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = this.createAnnualChart();
    this.loadData();
  }

  onYearChange(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = this.createAnnualChart();
  }

  onYearMonthChange(): void {
    var date = new Date(this.yearMonth);
    console.log(this.yearMonth + " is " + date);
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = this.createMonthlyChart();  
}

  onReportTypeChange(): void {
    console.log("report type = " + this.reportType);
    if (this.reportType == '0') {
      var element = document.getElementById('inputYearMonth');
      if (element) {
        element.className = 'chart-input-invisible';
      }
      element = document.getElementById('inputYear');
      if (element) {
        element.className = 'chart-input-visible';
      }
      if (this.chart) {
        this.chart.destroy();
      }
      this.chart = this.createAnnualChart();  
    } else {
      var element = document.getElementById('inputYearMonth');
      if (element) {
        element.className = 'chart-input-visible';
      }
      element = document.getElementById('inputYear');
      if (element) {
        element.className = 'chart-input-invisible';
      }
      if (this.chart) {
        this.chart.destroy();
      }
      this.chart = this.createMonthlyChart();  
    }
  }
 
  createAnnualChart(): Chart {
    var earnings = this.getAnnualEarnings();
    var spendings = this.getAnnualSpendings();
    var balance = [];
    for (var i = 0; i < earnings.length; ++i) {
      balance.push(earnings[i] - spendings[i]);
    }
    return new Chart("BarChart", {
      type: 'bar',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
          {
            label: "Earnings",
            data: earnings,
            backgroundColor: 'lightblue'
          },
          {
            label: "Spendings",
            data: spendings,
            backgroundColor: 'lightyellow'
          },
          {
            label: "Balance",
            data: balance,
            backgroundColor: 'darkgreen'
          },
        ]
      }
    });
  }

  createMonthlyChart(): Chart {
    const yearMonthDate = new Date(this.yearMonth);
    const year = yearMonthDate.getUTCFullYear();
    const month = yearMonthDate.getUTCMonth();
    console.log("monthly chart: " + year + ", " + month);
    const daysInMonth = this.countDaysInMonth(year, month);
    var earnings = this.getMonthlyEarnings(yearMonthDate, daysInMonth);
    var spendings = this.getMonthlySpendings(yearMonthDate, daysInMonth);
    var balance = [];
    for (var i = 0; i < earnings.length; ++i) {
      balance.push(earnings[i] - spendings[i]);
    }
    let dateLabels = [];
    for (let day = 1; day <= daysInMonth; ++day) {
      let dateLabel = ('' + (month + 1)).padStart(2, '0') + '/'  + ('' + day).padStart(2, '0');
      dateLabels.push(dateLabel);
    }
    return new Chart("BarChart", {
      type: 'bar',
      data: {
        labels: dateLabels,
        datasets: [
          {
            label: "Earnings",
            data: earnings,
            backgroundColor: 'lightblue'
          },
          {
            label: "Spendings",
            data: spendings,
            backgroundColor: 'lightyellow'
          },
          {
            label: "Balance",
            data: balance,
            backgroundColor: 'darkgreen'
          },
        ]
      }
    });
  }

  isFirebaseTimestamp(timestamp: any): timestamp is { seconds: number, nanoseconds: number } {
    return timestamp && typeof timestamp.seconds === 'number' && typeof timestamp.nanoseconds === 'number';
  }

  loadData(): void {
    const userID = this.auth.getUserId();
    if (!userID) {
      console.error('User ID not available');
      return;
    }
  
    let earnings: Array<EarningTableEntry> = new Array();
    let spendings: Array<PayingTableEntry> = new Array();
  
    this.firestore.collection('newEarningMoney', ref => ref.where('userID', '==', userID))
      .snapshotChanges()
      .subscribe(actions => {
        earnings = actions.map(a => {
          const data = a.payload.doc.data() as EarningTableEntry;
          const earningId = a.payload.doc.id;
  
          // Convert Timestamps to Dates
          if (data.recurrence) {
            if (this.isFirebaseTimestamp(data.recurrence.beginDate)) {
              data.recurrence.beginDate = new Date(data.recurrence.beginDate.seconds * 1000);
            }
            if (this.isFirebaseTimestamp(data.recurrence.endDate)) {
              data.recurrence.endDate = new Date(data.recurrence.endDate.seconds * 1000);
            }
          }
  
          return { earningId, ...data };
        });
        earnings.forEach(earning => {
          const year = earning.recurrence.beginDate.getUTCFullYear();
          const month = earning.recurrence.beginDate.getUTCMonth();
          const day = earning.recurrence.beginDate.getUTCDay();

          console.log(`earning year ${year} month ${month} day ${day}`);

          let key = "" + year;
          if (!this.annualEarnings.has(key)) {
            this.annualEarnings.set(key, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
          }
          const earningsPerMonth = this.annualEarnings.get(key)!;
          earningsPerMonth[month] += earning.amount;

          key = "" + year + "" + month;
          if (!this.monthlyEarnings.has(key)) {
            const daysInMonth = this.countDaysInMonth(year, month);
            let a = [];
            for (var i = 0; i < daysInMonth; ++i) {
              a.push(0);
            }
            this.monthlyEarnings.set(key, a);
          }
          const earningsPerDay = this.monthlyEarnings.get(key)!;
          earningsPerDay[day] += earning.amount;
        });
        this.onReportTypeChange();
      });
  
    this.firestore.collection('newPayingMoney', ref => ref.where('userID', '==', userID))
      .snapshotChanges()
      .subscribe(actions => {
        spendings = actions.map(a => {
          const data = a.payload.doc.data() as EarningTableEntry;
          const spendingId = a.payload.doc.id;

          // Convert Timestamps to Dates
          if (data.recurrence) {
            if (this.isFirebaseTimestamp(data.recurrence.beginDate)) {
              data.recurrence.beginDate = new Date(data.recurrence.beginDate.seconds * 1000);
            }
            if (this.isFirebaseTimestamp(data.recurrence.endDate)) {
              data.recurrence.endDate = new Date(data.recurrence.endDate.seconds * 1000);
            }
          }

          return { spendingId, ...data };
        });
        spendings.forEach(spending => {
          const year = spending.recurrence.beginDate.getUTCFullYear();
          const month = spending.recurrence.beginDate.getUTCMonth();
          const day = spending.recurrence.beginDate.getUTCDay();
          console.log(`spending year ${year} month ${month} day ${day}`);
          let key = "" + year;
          if (!this.annualSpendings.has(key)) {
            this.annualSpendings.set(key, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
          }
          const spendingsPerMonth = this.annualSpendings.get(key)!;
          spendingsPerMonth[month] += spending.amount;

          key = "" + year + "" + month;
          if (!this.monthlySpendings.has(key)) {
            const daysInMonth = this.countDaysInMonth(year, month);
            let a = [];
            for (var i = 0; i < daysInMonth; ++i) {
              a.push(0);
            }
            this.monthlySpendings.set(key, a);
          }
          const spendingsPerDay = this.monthlySpendings.get(key)!;
          spendingsPerDay[day] += spending.amount;

        });
        this.onReportTypeChange();
      });
  }

  getAnnualEarnings(): Array<number> {
    let result = this.annualEarnings.get(this.year);
    if (result) {
      return result;
    }
    return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  }

  getAnnualSpendings(): Array<number> {
    let result = this.annualSpendings.get(this.year);
    if (result) {
      return result;
    }
    return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  }

  getMonthlyEarnings(yearMonth: Date, numberOfDaysInMonth: number): Array<number> {
    const key = "" + yearMonth.getUTCFullYear() + "" + yearMonth.getUTCMonth();
    const result = this.monthlyEarnings.get(key);
    if (result) {
      return result;
    }
    const a = new Array()
    for (var i = 0; i < numberOfDaysInMonth; ++i) {
      a.push(0);
    }
    return a;
  }

  getMonthlySpendings(yearMonth: Date, numberOfDaysInMonth: number): Array<number> {
    const key = "" + yearMonth.getUTCFullYear() + "" + yearMonth.getUTCMonth();
    const result = this.monthlySpendings.get(key);
    if (result) {
      return result;
    }
    const a = new Array()
    for (var i = 0; i < numberOfDaysInMonth; ++i) {
      a.push(0);
    }
    return a;
  }

  getAnnualEarnings2(): Array<number> {
    if (this.year == '2023') {
      return [
        11101,
        11513,
        9537,
        8856,
        7503,
        12032,
        11853,
        10903,
        9867,
        7831,
        10993,
        11111
      ];
    }
    if (this.year == '2022') {
      return [
        9283,
        15621,
        11928,
        7282,
        11627,
        13672,
        14892,
        10928,
        18290,
        5627,
        12832,
        9289
      ];
    }
    if (this.year == '2021') {
      return [
        7283,
        6273,
        9382,
        8832,
        8273,
        9282,
        6726,
        3827,
        10928,
        8219,
        3990,
        8278
      ];
    }
    return [
      6272,
      7828,
      9283,
      7382,
      9278,
      7282,
      9135,
      6122,
      9002,
      8720,
      9821,
      9432
    ];
  }

  getAnnualSpendings2(): Array<number> {
    if (this.year == '2023') {
      return [
        10272,
        12637,
        8372,
        7625,
        7453,
        11727,
        11763,
        9273,
        10827,
        7520,
        9282,
        11027
      ];
    }
    if (this.year == '2022') {
      return [
        10928,
        11726,
        10933,
        6555,
        10929,
        11888,
        13627,
        9928,
        10283,
        10936,
        11782,
        9182
      ];
    }
    if (this.year == '2021') {
      return [
        7026,
        6172,
        10928,
        8789,
        8099,
        8799,
        7023,
        7721,
        9890,
        7018,
        7940,
        7263
      ];
    }
    return [
      5647,
      6483,
      8272,
      6372,
      8927,
      8261,
      9018,
      7619,
      8029,
      7267,
      8172,
      8927
    ];
  }

  getMonthlyEarnings2(yearMonth: Date, numberOfDaysInMonth: number): Array<number> {
    const result = [];
    for (var i = 0; i < numberOfDaysInMonth; ++i) {
      const earning = 100 + Math.random() * 100;
      result.push(earning);
    }
    return result;
  }

  getMonthlySpendings2(yearMonth: Date, numberOfDaysInMonth: number): Array<number> {
    const result = [];
    for (var i = 0; i < numberOfDaysInMonth; ++i) {
      const spending = 90 + Math.random() * 90;
      result.push(spending);
    }
    return result;
  }

  // https://javascript.plainenglish.io/how-to-determine-the-number-of-days-in-a-month-with-javascript-3d837575a398
  countDaysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
  }
}
