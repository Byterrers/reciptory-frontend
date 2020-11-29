import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

// Entities.
import { ProductDto } from '../entities/dtos/product.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private httpService: HttpService) {}

  getProducts(): Observable<any> {
    return this.httpService.get('/products');
  }

  getProductById(productId: string): Observable<any> {
    return this.httpService.get(`/products/${productId}`);
  }

  insertProduct(product: ProductDto): Observable<any> {
    return this.httpService.post('/products', product);
  }

  insertUserProduct(userId: string, product: ProductDto, place: number): Observable<any> {
    return this.httpService.post(`/products/user-products/${userId}/location/${place}`, product);
  }

  insertUserScannedProducts(userId: string, products: ProductDto[], place: number): Observable<any> {
    return this.httpService.post(`/products/scanned-user-products/${userId}/location/${place}`, products);
  }

  updateProduct(product: ProductDto): Observable<any> {
    return this.httpService.put(`/products/${product.id}`, product);
  }

  deleteProduct(productId: string): Observable<any> {
    return this.httpService.delete(`/products/${productId}`);
  }

  deleteUserProduct(userId: string, productId: string): Observable<any> {
    return this.httpService.delete(
      `/products/user-products/${userId}/${productId}`
    );
  }

  findProductById(productId: string): Observable<any> {
    return this.httpService.get(`/products/${productId}`);
  }
}
