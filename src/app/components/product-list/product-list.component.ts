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

  constructor(private productService: ProductService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
    // if we use the code below instead, there will be now effect when clicking on different link (coffee mugs).
    // this.listProducts();
  }

  private listProducts(): void {
    // check if id parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      // get the "id" param string and convert it into a number
      this.currentCategoryId =  Number(this.route.snapshot.paramMap.get('id'));
    }
    else {
      // not category id available ... default to category id 1
      this.currentCategoryId = 1;
    }

    // now, get the products for this given category id
    // .getProductList is async method, hence subscribe waits until all info is read.
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {this.products = data;}
    )
  }

}
