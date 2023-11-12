import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
import { EarningTableEntry } from 'src/app/model/earning-table-entry';
import { Recurrence, RecurrenceType } from 'src/app/model/recurrence';
import { CommonModule } from '@angular/common';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

export interface MatGridListTile {
  cols: number;
  cssClass: string;
  content: string;
}

function dateToString(d: Date): string {
  var year = d.getFullYear().toString();
  var month = (d.getMonth() + 1).toString().padStart(2, "0");
  var day = d.getDate().toString().padStart(2, "0");
  var hour = d.getHours().toString().padStart(2, "0");
  var minute = d.getMinutes().toString().padStart(2, "0");
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

function recurrenceToString(rec: Recurrence): string {
  var result = "";
  if (rec.recurrenceType == RecurrenceType.OneOff) {
    result =  "One off on " + dateToString(rec.beginDate);
  } else if (rec.recurrenceType == RecurrenceType.Daily) {
    result = "Daily from " + dateToString(rec.beginDate);
  } else if (rec.recurrenceType == RecurrenceType.Weekly) {
    result = "Weekly from " + dateToString(rec.beginDate);
  } else if (rec.recurrenceType == RecurrenceType.Monthly) {
    result = "Monthly from " + dateToString(rec.beginDate);
  } else if (rec.recurrenceType == RecurrenceType.Annually) {
    result = "Annualy from " + dateToString(rec.beginDate);
  } else {
    return "Unknown";
  }
  if (rec.endDate != null) {
    result += " to " + dateToString(rec.endDate);
  }
return result;
}

function stringToRecurrenceType(rec: string): RecurrenceType {
  if (rec == "oneoff") {
    return RecurrenceType.OneOff;
  }
  if (rec == "daily") {
    return RecurrenceType.Daily;
  }
  if (rec == "weekly") {
    return RecurrenceType.Weekly;
  }
  if (rec == "monthly") {
    return RecurrenceType.Monthly;
  }
  if (rec == "annually") {
    return RecurrenceType.Annually;
  }
  throw new Error("Unknown recurrence string: " + rec);
}

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.html',
  styleUrls: ['./earnings.css'],
})
export class EarningsComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    if (!this.auth.checkUserLogin()) {
      this.router.navigate(['login']);
    }

    this.earnings.push({name: "Found money 1", amount: 1000, recurrence: {recurrenceType: RecurrenceType.OneOff, beginDate: new Date("2023-11-08 10:00:00")}});
    this.earnings.push({name: "Found money 2", amount: 100, recurrence: {recurrenceType: RecurrenceType.Daily, beginDate: new Date("2023-11-09 10:00:00")}});
    this.earnings.push({name: "Found money 3", amount: 300, recurrence: {recurrenceType: RecurrenceType.Weekly, beginDate: new Date("2023-11-10 10:00:00")}});
    this.earnings.push({name: "Found money 4", amount: 2000, recurrence: {recurrenceType: RecurrenceType.Monthly, beginDate: new Date("2023-11-11 10:00:00")}});
    this.earnings.push({name: "Found money 5", amount: 500, recurrence: {recurrenceType: RecurrenceType.Annually, beginDate: new Date("2023-11-12 10:00:00")}});
    this.updateMatGridList();
  }

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

  onAddNewEarning(): void {
    const modalWindow = this.dialog.open(AddEarningModal, {
      data: { name: null, amount: null, recurrence: null, beginDate: null },
      height: "450px",
      width: "600px",
    });
    modalWindow.afterClosed().subscribe(result => {
      if (!modalWindow.componentInstance.modalResult) {
        return;
      }
      const earningName = modalWindow.componentInstance.data.name;
      const earningAmount = modalWindow.componentInstance.data.amount;
      const earningRecurrence = modalWindow.componentInstance.data.recurrence;
      const earningBeginDate = new Date(modalWindow.componentInstance.data.beginDate);
      if (earningName == null || earningAmount == null || earningAmount < 0 || earningRecurrence == null || earningBeginDate == null) {
        alert("Failed to add a new earning. Please, fill all fields in the form.");
        window.setTimeout(() => { this.onAddNewEarning() }, 100);
      }

      this.earnings.push({
        name: earningName,
        amount: earningAmount,
        recurrence: {
          recurrenceType: stringToRecurrenceType(earningRecurrence),
          beginDate: earningBeginDate
        }
      });
      this.updateMatGridList();
    });
  }

  onDeleteEarning(): void {
    const names = new Array<String>();
    this.earnings.forEach(earning => {
      names.push(earning.name);
    });
    const modalWindow = this.dialog.open(DeleteEarningModal, {
      data: { earningNames: names, chosenName: "" },
      height: "450px",
      width: "600px",
    });
    modalWindow.afterClosed().subscribe(result => {
      if (!modalWindow.componentInstance.modalResult) {
        return;
      }
      const chosenName = modalWindow.componentInstance.data.chosenName;
      var modifiedEarnings = new Array<EarningTableEntry>();
      this.earnings.forEach(e => {
        if (e.name != chosenName) {
          modifiedEarnings.push(e)
        }
      });
      this.earnings = modifiedEarnings;
      this.updateMatGridList();
    });
  }

  earnings: Array<EarningTableEntry> = new Array();
  tiles: Array<MatGridListTile> = new Array();
}

export interface AddEarningModalData {
  name: string;
  amount: number;
  recurrence: string;
  beginDate: Date;
};

@Component({
  selector: 'modal-add-earning',
  templateUrl: './modalAddEarning.html',
  styleUrls: ['./modalAddEarning.css'],
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
})
export class AddEarningModal {

  modalResult: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddEarningModal>,
    @Inject(MAT_DIALOG_DATA) public data: AddEarningModalData
  ) {
  }

  onAddClick(): void {
    console.log("onAddClick");
    this.modalResult = true;
  }

  onCancelClick(): void {
    console.log("onCancelClick");
    this.modalResult = false;
  }
}

export interface DeleteEarningModalData {
  earningNames: Array<String>;
  chosenName: string;
};

@Component({
  selector: 'modal-delete-earning',
  templateUrl: './modalDeleteEarning.html',
  styleUrls: ['./modalDeleteEarning.css'],
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
})
export class DeleteEarningModal {

  modalResult: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DeleteEarningModal>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteEarningModalData
  ) {
  }

  onDeleteClick(): void {
    console.log("onDeleteClick");
    this.modalResult = true;
  }

  onCancelClick(): void {
    console.log("onCancelClick");
    this.modalResult = false;
  }
}
