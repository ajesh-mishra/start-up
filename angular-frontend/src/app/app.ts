import { DatePipe, CurrencyPipe } from '@angular/common';
import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductCreateDto, ProductDto, ProductService } from './product.service';
import { MonthlyTotalDto, PurchaseDto, PurchaseService } from './purchase.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { forkJoin, of } from 'rxjs';

interface EditablePurchaseI {
  id: number | null;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  purchaseDate: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DatePipe, CurrencyPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private purchaseService = inject(PurchaseService);
  private productService = inject(ProductService);

  protected readonly daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  protected readonly todaysDate = signal(new Date());
  protected readonly todaysDateString = computed(() => new Intl.DateTimeFormat('en-CA').format(this.todaysDate()));

  protected selectedDate = signal(new Date());
  protected selectedDateString = computed(() => new Intl.DateTimeFormat('en-CA').format(this.selectedDate()));
  protected isSaved = signal(false);
  protected showAddProductModal = signal(false);
  protected showCreateProductModal = signal(false);
  protected selectedProductIds = signal<number[]>([]);
  protected removedPurchaseIds = signal<number[]>([]);
  protected newProductName = signal('');
  protected newProductCategory = signal('');
  protected newProductPrice = signal('');
  protected isCreatingProduct = signal(false);
  protected createProductError = signal('');

  productsRx = rxResource<ProductDto[], void>({
    stream: () => this.productService.getProducts(),
  });

  purchaseRx = rxResource<PurchaseDto[], string>({
    params: () => this.selectedDateString(),
    stream: ({ params }) => this.purchaseService.getPurchaseByDate(params),
  });

  monthlyTotalRx = rxResource<MonthlyTotalDto, { year: number; month: number }>({
    params: () => {
      const currentDate = this.selectedDate();
      return {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
      };
    },
    stream: ({ params }) => this.purchaseService.getTotalPurchaseByMonth(params.year, params.month),
  });

  monthlyPurchaseRx = rxResource<PurchaseDto[], { year: number; month: number }>({
    params: () => {
      const currentDate = this.selectedDate();
      return {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
      };
    },
    stream: ({ params }) => this.purchaseService.getPurchaseByMonth(params.year, params.month),
  });

  editablePurchase = linkedSignal(() => {
    const products = this.productsRx.value() ?? [];
    const purchases = this.purchaseRx.value() ?? [];
    const productsById = new Map(
      products
        .filter((product): product is ProductDto & { id: number } => product.id !== null)
        .map((product) => [product.id, product]),
    );

    return purchases
      .map((purchase) => {
        const product = productsById.get(purchase.product_id);
        if (!product) return null;

        return {
          id: purchase.id,
          productId: product.id,
          productName: product.name,
          unitPrice: product.price,
          quantity: purchase.quantity,
          purchaseDate: this.selectedDateString(),
        } satisfies EditablePurchaseI;
      })
      .filter((purchase): purchase is EditablePurchaseI => purchase !== null);
  });

  protected availableProducts = computed(() => {
    const products = this.productsRx.value() ?? [];
    const selectedIds = new Set(this.editablePurchase().map((purchase) => purchase.productId));

    return products
      .filter((product): product is ProductDto & { id: number } => product.id !== null)
      .filter((product) => !selectedIds.has(product.id));
  });

  protected availableProductsCount = computed(() => this.availableProducts().length);
  protected hasEditablePurchase = computed(() => this.editablePurchase().length > 0);

  protected hasPurchaseChanges = computed(() => {
    const originalPurchases = this.purchaseRx.value() ?? [];
    const currentPurchases = this.editablePurchase();

    const originalQtyByProductId = new Map(
      originalPurchases.map((purchase) => [purchase.product_id, purchase.quantity]),
    );
    const currentQtyByProductId = new Map(currentPurchases.map((purchase) => [purchase.productId, purchase.quantity]));

    if (originalQtyByProductId.size !== currentQtyByProductId.size) {
      return true;
    }

    for (const [productId, originalQty] of originalQtyByProductId.entries()) {
      const currentQty = currentQtyByProductId.get(productId);
      if (currentQty === undefined || currentQty !== originalQty) {
        return true;
      }
    }

    return false;
  });

  protected canSave = computed(() => {
    if (!this.isExistingPurchase()) {
      return this.hasEditablePurchase();
    }

    return this.hasPurchaseChanges();
  });

  protected totalAmount = computed(() =>
    this.editablePurchase().reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  );

  protected monthlyTotalAmount = computed(() => {
    const serverMonthlyTotal = this.monthlyTotalRx.value()?.total ?? 0;

    const originalSelectedDateTotal = (this.purchaseRx.value() ?? []).reduce(
      (sum, purchase) => sum + purchase.price * purchase.quantity,
      0,
    );

    const currentSelectedDateTotal = this.editablePurchase().reduce(
      (sum, purchase) => sum + purchase.unitPrice * purchase.quantity,
      0,
    );

    return serverMonthlyTotal + (currentSelectedDateTotal - originalSelectedDateTotal);
  });

  protected purchasedDaysInMonth = computed(() => {
    const purchases = this.monthlyPurchaseRx.value() ?? [];
    const purchasedDays = new Set<number>();

    for (const purchase of purchases) {
      const day = this.extractDayFromPurchaseDate(purchase.purchase_date);
      if (day !== null) {
        purchasedDays.add(day);
      }
    }

    return purchasedDays;
  });

  protected isExistingPurchase = computed(() => (this.purchaseRx.value() ?? []).length > 0);

  protected openAddProductModal() {
    this.selectedProductIds.set([]);
    this.showAddProductModal.set(true);
  }

  protected closeAddProductModal() {
    this.showAddProductModal.set(false);
    this.selectedProductIds.set([]);
  }

  protected openCreateProductModal() {
    this.showAddProductModal.set(false);
    this.showCreateProductModal.set(true);
    this.newProductName.set('');
    this.newProductCategory.set('');
    this.newProductPrice.set('');
    this.createProductError.set('');
  }

  protected closeCreateProductModal() {
    this.showCreateProductModal.set(false);
    this.newProductName.set('');
    this.newProductCategory.set('');
    this.newProductPrice.set('');
    this.createProductError.set('');
  }

  protected onNewProductNameChange(value: string) {
    this.newProductName.set(value);
  }

  protected onNewProductCategoryChange(value: string) {
    this.newProductCategory.set(value);
  }

  protected onNewProductPriceChange(value: string) {
    this.newProductPrice.set(value);
  }

  protected canCreateProduct() {
    const price = Number(this.newProductPrice());
    return (
      this.newProductName().trim().length > 0 &&
      this.newProductCategory().trim().length > 0 &&
      Number.isInteger(price) &&
      price >= 0
    );
  }

  protected createNewProduct() {
    if (!this.canCreateProduct() || this.isCreatingProduct()) {
      return;
    }

    const payload: ProductCreateDto = {
      name: this.newProductName().trim(),
      category: this.newProductCategory().trim(),
      price: Number(this.newProductPrice()),
    };

    this.isCreatingProduct.set(true);
    this.createProductError.set('');

    this.productService.createProducts([payload]).subscribe({
      next: () => {
        this.isCreatingProduct.set(false);
        this.showCreateProductModal.set(false);
        this.productsRx.reload();
        this.showAddProductModal.set(true);
      },
      error: () => {
        this.isCreatingProduct.set(false);
        this.createProductError.set('Failed to create product. Please try again.');
      },
    });
  }

  protected isProductSelected(productId: number) {
    return this.selectedProductIds().includes(productId);
  }

  protected toggleProductSelection(productId: number, isChecked: boolean) {
    this.selectedProductIds.update((selectedIds) => {
      if (isChecked) {
        if (selectedIds.includes(productId)) return selectedIds;
        return [...selectedIds, productId];
      }

      return selectedIds.filter((id) => id !== productId);
    });
  }

  protected addSelectedProducts() {
    const selectedIds = this.selectedProductIds();
    if (!selectedIds.length) {
      this.closeAddProductModal();
      return;
    }

    const productsById = new Map(this.availableProducts().map((product) => [product.id, product]));

    this.editablePurchase.update((purchases) => {
      const existingIds = new Set(purchases.map((purchase) => purchase.productId));

      const productsToAdd = selectedIds
        .map((id) => productsById.get(id))
        .filter((product): product is ProductDto & { id: number } => product !== undefined)
        .filter((product) => !existingIds.has(product.id))
        .map((product) => ({
          id: null,
          productId: product.id,
          productName: product.name,
          unitPrice: product.price,
          quantity: 1,
          purchaseDate: this.selectedDateString(),
        }));

      return [...purchases, ...productsToAdd];
    });

    this.closeAddProductModal();
  }

  increment(productId: number) {
    this.editablePurchase.update((purchases) =>
      purchases.map((purchase) =>
        purchase.productId === productId ? { ...purchase, quantity: purchase.quantity + 1 } : purchase,
      ),
    );
  }

  decrement(productId: number) {
    let removedPersistedId: number | null = null;

    this.editablePurchase.update((purchases) =>
      purchases.flatMap((purchase) => {
        if (purchase.productId !== productId) return [purchase];
        if (purchase.quantity > 1) return [{ ...purchase, quantity: purchase.quantity - 1 }];
        if (purchase.id !== null) {
          removedPersistedId = purchase.id;
        }
        return [];
      }),
    );

    if (removedPersistedId !== null) {
      this.removedPurchaseIds.update((removedIds) =>
        removedIds.includes(removedPersistedId as number) ? removedIds : [...removedIds, removedPersistedId as number],
      );
    }
  }

  save() {
    if (!this.canSave()) {
      return;
    }

    const purchases = this.editablePurchase();
    const upsertOperations = purchases
      .filter((item) => item.quantity > 0)
      .map((item) => {
        if (item.id === null) {
          return this.purchaseService.createPurchase({
            purchase_date: item.purchaseDate,
            product_id: item.productId,
            quantity: item.quantity,
          });
        }

        return this.purchaseService.updatePurchase(item.id, {
          purchase_date: item.purchaseDate,
          product_id: item.productId,
          quantity: item.quantity,
        });
      });

    const deleteOperations = this.removedPurchaseIds().map((id) => this.purchaseService.deletePurchase(id));
    const operations = [...upsertOperations, ...deleteOperations];

    if (!operations.length) {
      this.isSaved.set(true);
      setTimeout(() => this.isSaved.set(false), 3000);
      return;
    }

    forkJoin(operations.length ? operations : [of(null)]).subscribe((data) => {
      console.log('Purchase saved successfully', data);
      this.removedPurchaseIds.set([]);
      this.purchaseRx.reload();
      this.monthlyTotalRx.reload();
      this.monthlyPurchaseRx.reload();
    });

    this.isSaved.set(true);
    setTimeout(() => this.isSaved.set(false), 3000);
  }

  protected productIcon(productName: string) {
    const trimmedName = productName.trim();
    if (!trimmedName) {
      return '?';
    }

    return trimmedName.charAt(0).toUpperCase();
  }

  protected hasPurchaseOnDay(day: number) {
    return day > 0 && this.purchasedDaysInMonth().has(day);
  }

  updateSelectedDate(day: number) {
    const selectedDate = new Date(this.selectedYear(), parseInt(this.selectedMonth()) - 1, day);
    this.removedPurchaseIds.set([]);
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
    this.removedPurchaseIds.set([]);
    this.selectedDate.set(nextMonthDate);
  }

  protected prevMonth() {
    const currentDate = this.selectedDate();
    const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    this.removedPurchaseIds.set([]);
    this.selectedDate.set(prevMonthDate);
  }

  private extractDayFromPurchaseDate(purchaseDate: Date | string): number | null {
    if (purchaseDate instanceof Date) {
      return Number.isNaN(purchaseDate.getTime()) ? null : purchaseDate.getDate();
    }

    const match = purchaseDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) {
      return null;
    }

    const day = Number(match[3]);
    return Number.isInteger(day) && day > 0 ? day : null;
  }
}
