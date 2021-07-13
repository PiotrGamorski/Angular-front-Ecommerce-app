import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../common/country';

@Injectable({
  providedIn: 'root',
})
export class Luv2ShopFormService {
  constructor(private httpClient: HttpClient) {}

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

  // GET DATA FROM DATABASE
  getCountries(searchUrl: string): Observable<Country[]> {
    return this.httpClient
      .get<GetResponseCountry>(searchUrl)
      .pipe(map((response) => response._embedded.countries));
  }

  // END OF CLASS
}

export interface GetResponseCountry {
  _embedded: {
    countries: Country[];
  };
}
