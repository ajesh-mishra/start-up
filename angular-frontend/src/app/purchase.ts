import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';

export interface PurchaseI {
  id: number;
  milk: number;
  yogurt: number;
  paneer: number;
  purchase_date: Date | string;
}

@Injectable({
  providedIn: 'root',
})
export class Purchase {
  private http = inject(HttpClient);
  private url = '/api';

  getPurchaseByDate(date: string): Observable<PurchaseI | null> {
    return this.http
      .get<PurchaseI>(`${this.url}/purchase/daily-expense`, {
        params: {
          purchase_date: date,
        },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            return of(null);
          }
          return throwError(() => error);
        }),
      );
  }

  createPurchase(purchase: PurchaseI): Observable<PurchaseI> {
    return this.http.post<PurchaseI>(`${this.url}/purchase`, purchase);
  }

  updatePurchase(purchase: PurchaseI): Observable<PurchaseI> {
    const { id, ...payload } = purchase;
    return this.http.put<PurchaseI>(`${this.url}/purchase/${id}`, payload);
  }
}
