import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../common/product';
import { catchError, map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl: string = 'http://localhost:8080/api/products';
  private categoryUrl: string = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) { }

  private handleError<T>(operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.log(error);
      return of(result as T);
    };
  }

  getProductList(theCategoryId: number): Observable<Product[]> {

    const searchUrl: string = this.baseUrl + "/search/findByCategoryId?id=" + theCategoryId;

    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products),
      catchError(this.handleError<Product[]>('getProducts', []))
    );
  };

  getProductCategories(): Observable<ProductCategory[]>{

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory),
      catchError(this.handleError<ProductCategory[]>('getProductCategories', []))
    );
  };

}

  interface GetResponseProducts {
    _embedded: {
      products: Product[];
    }
  }

  interface GetResponseProductCategory {
    _embedded: {
      productCategory: ProductCategory[];
    }
  }
