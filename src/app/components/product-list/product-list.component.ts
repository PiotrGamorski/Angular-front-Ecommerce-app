import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 0;
  searchMode: boolean = false;

  constructor(private productService: ProductService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
    // if we use the code below instead, there will be now effect when clicking on different link (coffee mugs).
    // this.listProducts();
  }

  private listProducts(): void {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode) {
      this.handleSearchProducts();
    }
    else{
      this.handleListProducts();
    };
  };

  private handleSearchProducts():void {
    const theKeyword: string | undefined = this.route.snapshot.paramMap.get('keyword')?.toString();

    // now, search for the products using keyword
    this.productService.searchProducts(theKeyword).subscribe(
      data => {this.products = data;}
    );
  };

  private handleListProducts(): void {
        // check if id parameter is available
        const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

        if(hasCategoryId){
          // get the "id" param string and convert it into a number
          this.currentCategoryId = Number(this.route.snapshot.paramMap.get('id'));
        }
        else {
          // not category id available ... default to category id 1
          this.currentCategoryId = 1;
        }
    
        // now, get the products for this given category id
        this.productService.getProductList(this.currentCategoryId).subscribe(
          data => {this.products = data;}
        )
  };

}
