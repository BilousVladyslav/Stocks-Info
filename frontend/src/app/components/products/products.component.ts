import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductInfo } from 'src/app/core/models/product.model';
import { ProductService } from 'src/app/core/services/product.service';
import { AuthenticationService } from 'src/app/core/services/authorization.service';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
 
export class ProductsComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  products: ProductInfo[] = [];
  isLogged = false;

  constructor(
    private productService: ProductService,
    private authorizationService: AuthenticationService,
  ) {
    authorizationService.token.subscribe(value => this.isLogged = value != null);
    this.subscription.add(this.productService.GetProducts()
      .subscribe(data => {
        this.products = data;
      })
    );
  }
  
  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}