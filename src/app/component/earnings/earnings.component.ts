import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
import { EarningTableEntry } from 'src/app/model/earning-table-entry';
import { Recurrence, RecurrenceType } from 'src/app/model/recurrence';

import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {NgIf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

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
      data: { name: "booo", amount: 0 },
      height: "400px",
      width: "600px",
    });
    modalWindow.afterClosed().subscribe(result => {
      console.log(JSON.stringify(result));
    });
  }

  earnings: Array<EarningTableEntry> = new Array();
  tiles: Array<MatGridListTile> = new Array();
}

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