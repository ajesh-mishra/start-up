import { DatePipe, CurrencyPipe } from '@angular/common';
import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Purchase, PurchaseI } from './purchase';
import { rxResource } from '@angular/core/rxjs-interop';
import { Price } from './price';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DatePipe, CurrencyPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private http = inject(HttpClient);
  private purchaseService = inject(Purchase);
  protected priceService = inject(Price);

  protected readonly daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  protected readonly todaysDate = signal(new Date());
  protected readonly todaysDateString = computed(() => new Intl.DateTimeFormat('en-CA').format(this.todaysDate()));

  protected selectedDate = signal(new Date());
  protected selectedDateString = computed(() => new Intl.DateTimeFormat('en-CA').format(this.selectedDate()));
  protected isSaved = signal(false);

  purchaseRx = rxResource<PurchaseI | null, string>({
    params: () => this.selectedDateString(),
    stream: ({ params }) => this.purchaseService.getPurchaseByDate(params),
  });

  editablePurchase = linkedSignal(() => {
    const purchase = this.purchaseRx.value();
    return purchase
      ? structuredClone(purchase)
      : {
          id: 0,
          milk: 0,
          yogurt: 0,
          paneer: 0,
          purchase_date: this.selectedDateString(),
        };
  });

  increment(item: string) {
    if (item === 'milk') {
      this.editablePurchase.update((purchase) => {
        if (purchase) {
          purchase.milk = purchase.milk + 1;
        }
        return purchase;
      });
    } else if (item === 'yogurt') {
      this.editablePurchase.update((purchase) => {
        if (purchase) {
          purchase.yogurt = purchase.yogurt + 1;
        }
        return purchase;
      });
    } else if (item === 'paneer') {
      this.editablePurchase.update((purchase) => {
        if (purchase) {
          purchase.paneer = purchase.paneer + 1;
        }
        return purchase;
      });
    }
  }

  decrement(item: string) {
    if (item === 'milk') {
      this.editablePurchase.update((purchase) => {
        if (purchase && purchase.milk > 0) {
          purchase.milk = purchase.milk - 1;
        }
        return purchase;
      });
    } else if (item === 'yogurt') {
      this.editablePurchase.update((purchase) => {
        if (purchase && purchase.yogurt > 0) {
          purchase.yogurt = purchase.yogurt - 1;
        }
        return purchase;
      });
    } else if (item === 'paneer') {
      this.editablePurchase.update((purchase) => {
        if (purchase && purchase.paneer > 0) {
          purchase.paneer = purchase.paneer - 1;
        }
        return purchase;
      });
    }
  }

  save() {
    const purchase = this.editablePurchase();

    if (!purchase) return;

    const id = purchase.id;

    if (id === 0) {
      this.purchaseService.createPurchase(purchase).subscribe((data) => {
        console.log('Purchase created successfully', data);
      });
    } else {
      this.purchaseService.updatePurchase(purchase).subscribe((data) => {
        console.log('Purchase updated successfully', data);
      });
    }

    this.isSaved.set(true);
    setTimeout(() => this.isSaved.set(false), 3000);
  }

  updateSelectedDate(day: number) {
    const selectedDate = new Date(this.selectedYear(), parseInt(this.selectedMonth()) - 1, day);
    this.selectedDate.set(selectedDate);
  }

  protected selectedMonth = computed(() => {
    const currentDate = this.selectedDate();
    return String(currentDate.getMonth() + 1).padStart(2, '0');
  });

  protected selectedYear = computed(() => this.selectedDate().getFullYear());

  protected totalDays = computed(() => {
    const currentDate = this.selectedDate();
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  });

  protected daysInMonth = computed(() => {
    const totalDays = this.totalDays();
    const firstDay = this.firstDayOfMonth();

    const leadingZeros = Array.from({ length: firstDay }, () => 0);
    const days = Array.from({ length: totalDays }, (_, i) => i + 1);

    return [...leadingZeros, ...days];
  });

  protected firstDayOfMonth = computed(() => {
    const currentDate = this.selectedDate();
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  });

  protected nextMonth() {
    const currentDate = this.selectedDate();
    const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    this.selectedDate.set(nextMonthDate);
  }

  protected prevMonth() {
    const currentDate = this.selectedDate();
    const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    this.selectedDate.set(prevMonthDate);
  }
}
