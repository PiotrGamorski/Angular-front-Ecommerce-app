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
  };

  private getProducts(searchUrl: string, getter: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products),
      catchError(this.handleError<Product[]>(getter, []))
    );
  };

  getProductList(theCategoryId: number): Observable<Product[]> {

    const searchUrl: string = this.baseUrl + "/search/findByCategoryId?id=" + theCategoryId;

    return this.getProducts(searchUrl, 'getProducts');
  };

  searchProducts(theKeyword: string | undefined): Observable<Product[]> {

    const searchUrl: string = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl, 'getProducts');
  };

  getProductCategories(): Observable<ProductCategory[]>{

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory),
      catchError(this.handleError<ProductCategory[]>('getProductCategories', []))
    );
  };

}; // END OF CLASS

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
