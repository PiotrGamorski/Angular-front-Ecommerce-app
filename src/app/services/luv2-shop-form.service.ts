import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Luv2ShopFormService {
  constructor() {}

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    // build an array for "Month" dropdown list
    // - start at desired startMonhts and loop until 12

    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }

    // The "of" operator from rxjs will wrap an object as an Observable
    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];

    // build an array for "Year" dropdown list
    // - start at desired startMonhts and loop until 10

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }

    // The "of" operator from rxjs will wrap an object as an Observable
    return of(data);
  }

  // END OF CLASS
}
