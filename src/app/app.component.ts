import { Component } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import { MatDatepickerInputEvent } from '@angular/material';

@Component({
  selector: 'app-root',
  template: `
      <form [formGroup]="form">
        <div *ngFor="let range of dates">{{range.begin.toLocaleDateString()}} - {{range.end.toLocaleDateString()}}</div>
        <mat-form-field>
            <input matInput
                placeholder="Choose a date"
                [satDatepicker]="picker"
                [min]="min"
                formControlName="date"
                (dateInput)="debug($event)"
                (dateChange)="dateChange($event)">
            <sat-datepicker #picker [rangeMode]="true"
            [closeAfterSelection]="false"
            [dateClass]="dateClass">
            </sat-datepicker>
            <sat-datepicker-toggle matSuffix [for]="picker"></sat-datepicker-toggle>
        </mat-form-field>
      </form>
`,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    min = new Date('2018/12/02');
    dates = [{ begin: new Date(2018, 11, 5), end: new Date(2018, 11, 7) }];
    form: FormGroup;
    constructor(fb: FormBuilder) {
        this.form = fb.group({
            date: [null]
        });
    }

    debug(e) {
        console.log(e);
    }

    dateClass = (date: Date) => {
        let classname;
        this.dates.forEach(daterange => {
          const begin = daterange.begin.valueOf(), end = daterange.end.valueOf(), d = date.valueOf();
          if (begin <= d && d <= end) {
            classname = 'selected';
          }
          if (begin === d) {
            classname += ' begin';
          }
          if (end === d) {
            classname += ' end';
          }
        });
        return classname;
      }

      dateChange(event: MatDatepickerInputEvent<{begin: Date, end: Date}>) {
        const range = event.value;
        console.log(range);
        if (!range) {return;}
        const newDates = [];
        let addNew = true;
        this.dates.forEach((daterange) => {
          const begin = daterange.begin.valueOf(), end = daterange.end.valueOf(), rbegin = range.begin.valueOf(), rend = range.end.valueOf();
          if ((rbegin < begin && rend < begin) || (rbegin > end && rend > end)) {
            newDates.push(daterange);
          } else if (rbegin === begin && rend === end) {
            addNew = false;
          }
        });
        if (addNew) {
          newDates.push(range);
        } else {
          //this.form.reset({date: newDates[0]});
        }
        this.form.reset();
        this.dates = newDates;
      }

}
