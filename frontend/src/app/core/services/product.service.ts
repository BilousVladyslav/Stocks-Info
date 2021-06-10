import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductInfo, ProductInfoDetail } from 'src/app/core/models/product.model';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  controllerUrl: string = environment.apiURL + '/product/';

  constructor(private http: HttpClient) {}

  GetProducts(): Observable<ProductInfo[]> {
    return this.http.get<ProductInfo[]>(this.controllerUrl);
  }

  RetrieveProduct(id: number): Observable<ProductInfoDetail> {
    return this.http.get<ProductInfoDetail>(this.controllerUrl + id as string + '/');
  }
}
