import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/expense-calculator/expense-calculator-page').then((module) => module.ExpenseCalculatorPage),
  },
];
