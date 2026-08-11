import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'expense-calculator',
  },
  {
    path: 'expense-calculator',
    loadComponent: () =>
      import('./pages/expense-calculator/expense-calculator-page').then((module) => module.ExpenseCalculatorPage),
  },
  {
    path: 'habit-tracker',
    loadComponent: () => import('./pages/habit-tracker/habit-tracker-page').then((module) => module.HabitTrackerPage),
  },
  {
    path: '**',
    redirectTo: 'expense-calculator',
  },
];
