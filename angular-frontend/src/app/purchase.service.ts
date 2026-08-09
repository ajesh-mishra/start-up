import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';

export interface PurchaseDto {
  id: number | null;
  product_id: number;
  quantity: number;
  price: number;
  purchase_date: Date | string;
}

export interface PurchaseCreateDto {
  purchase_date: Date | string;
  product_id: number;
  quantity: number;
  price?: number | null;
}

export interface PurchaseUpdateDto {
  purchase_date?: Date | string;
  product_id?: number;
  quantity?: number;
  price?: number;
}

export interface MonthlyTotalDto {
  month: string;
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private http = inject(HttpClient);
  private url = '/api';

  getPurchaseByDate(date: string): Observable<PurchaseDto[]> {
    return this.http
      .get<PurchaseDto[]>(`${this.url}/purchase/daily-expense`, {
        params: {
          purchase_date: date,
        },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            return of([]);
          }
          return throwError(() => error);
        }),
      );
  }

  getTotalPurchaseByMonth(year: number, month: number): Observable<MonthlyTotalDto> {
    return this.http.get<MonthlyTotalDto>(`${this.url}/purchase/total-monthly-expense`, {
      params: {
        year,
        month,
      },
    });
  }

  getPurchaseByMonth(year: number, month: number): Observable<PurchaseDto[]> {
    return this.http.get<PurchaseDto[]>(`${this.url}/purchase/monthly-expense`, {
      params: {
        year,
        month,
      },
    });
  }

  createPurchase(purchase: PurchaseCreateDto): Observable<PurchaseDto> {
    return this.http.post<PurchaseDto>(`${this.url}/purchase`, purchase);
  }

  updatePurchase(id: number, purchase: PurchaseUpdateDto): Observable<PurchaseDto> {
    return this.http.put<PurchaseDto>(`${this.url}/purchase/${id}`, purchase);
  }

  deletePurchase(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/purchase/${id}`);
  }
}
