import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface ProductDto {
  id: number | null;
  name: string;
  category: string;
  price: number;
}

export interface ProductCreateDto {
  name: string;
  category: string;
  price: number;
}

export type ProductPriceByName = Record<string, number>;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private url = '/api';

  getProducts(): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>(`${this.url}/product/`);
  }

  createProducts(products: ProductCreateDto[]): Observable<ProductDto[]> {
    return this.http.post<ProductDto[]>(`${this.url}/product/`, products);
  }

  getPriceByProductName(): Observable<ProductPriceByName> {
    return this.getProducts().pipe(
      map((products) =>
        products.reduce<ProductPriceByName>((prices, product) => {
          prices[product.name.trim().toLowerCase()] = product.price;
          return prices;
        }, {}),
      ),
    );
  }

  getPriceByName(productName: string): Observable<number | undefined> {
    const normalizedName = productName.trim().toLowerCase();
    return this.getPriceByProductName().pipe(map((prices) => prices[normalizedName]));
  }
}
