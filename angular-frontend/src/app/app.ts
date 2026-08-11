import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

interface NavigationItem {
  path: string;
  label: string;
  icon: 'expense' | 'habit';
  subPages: string[];
}

type PanePosition = 'left' | 'middle' | 'right';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly router = inject(Router);
  private readonly defaultViewportWidth = 1280;
  private dragPointerId: number | null = null;
  private dragStartPositionX = 0;
  private dragStartTranslateX = 0;

  protected readonly panePosition = signal<PanePosition>('middle');
  protected readonly isDragging = signal(false);
  protected readonly currentTranslateX = signal(0);
  private readonly viewportWidth = signal(this.getViewportWidth());

  protected readonly navigationItems: NavigationItem[] = [
    {
      path: '/expense-calculator',
      label: 'Expense Calculator',
      icon: 'expense',
      subPages: ['Daily Entry', 'Monthly Overview', 'Products'],
    },
    {
      path: '/habit-tracker',
      label: 'Habit Tracker',
      icon: 'habit',
      subPages: ['Today', 'Streaks', 'History'],
    },
  ];

  private readonly activePath = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.getCurrentPath()),
      startWith(this.getCurrentPath()),
    ),
    { initialValue: this.getCurrentPath() },
  );

  protected readonly activeSubPages = computed(() => {
    const currentPath = this.activePath();

    return this.navigationItems.find((item) => item.path === currentPath)?.subPages ?? [];
  });

  protected readonly middlePaneTransform = computed(() => {
    const currentTranslateX = this.currentTranslateX();

    if (!this.isDragging() && currentTranslateX === 0) {
      return 'none';
    }

    return `translateX(${currentTranslateX}px)`;
  });
  protected readonly middlePaneTransition = computed(() => (this.isDragging() ? 'none' : 'transform 0.3s ease-out'));

  protected onPanePointerDown(event: PointerEvent) {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }

    this.isDragging.set(true);
    this.dragPointerId = event.pointerId;
    this.dragStartPositionX = event.clientX;
    this.dragStartTranslateX = this.currentTranslateX();

    (event.currentTarget as HTMLElement | null)?.setPointerCapture(event.pointerId);
  }

  protected onPanePointerMove(event: PointerEvent) {
    if (!this.isDragging() || this.dragPointerId !== event.pointerId) {
      return;
    }

    const pointerDeltaX = event.clientX - this.dragStartPositionX;
    const unclampedTranslateX = this.dragStartTranslateX + pointerDeltaX;
    this.currentTranslateX.set(this.clampTranslateX(unclampedTranslateX));
  }

  protected onPanePointerUp(event: PointerEvent) {
    if (!this.isDragging() || this.dragPointerId !== event.pointerId) {
      return;
    }

    (event.currentTarget as HTMLElement | null)?.releasePointerCapture(event.pointerId);

    const movedBy = this.currentTranslateX() - this.dragStartTranslateX;
    const currentPanePosition = this.panePosition();

    if (currentPanePosition === 'middle') {
      if (movedBy > 20) {
        this.panePosition.set('left');
      } else if (movedBy < -20) {
        this.panePosition.set('right');
      }
    } else if (currentPanePosition === 'left') {
      if (movedBy < -20) {
        this.panePosition.set('middle');
      }
    } else if (movedBy > 20) {
      this.panePosition.set('middle');
    }

    this.isDragging.set(false);
    this.dragPointerId = null;
    this.snapMiddlePaneToCurrentPosition();
  }

  protected onViewportResize() {
    this.viewportWidth.set(this.getViewportWidth());
    this.snapMiddlePaneToCurrentPosition();
  }

  private getCurrentPath() {
    const firstSegment = this.router.url.split('?')[0].split('/')[1];
    return `/${firstSegment || 'expense-calculator'}`;
  }

  private getViewportWidth() {
    return typeof window === 'undefined' ? this.defaultViewportWidth : window.innerWidth;
  }

  private snapMiddlePaneToCurrentPosition() {
    const { showMiddlePane, showLeftPane, showRightPane } = this.getPaneTranslatePositions();
    const currentPanePosition = this.panePosition();

    if (currentPanePosition === 'left') {
      this.currentTranslateX.set(showLeftPane);
      return;
    }

    if (currentPanePosition === 'right') {
      this.currentTranslateX.set(showRightPane);
      return;
    }

    this.currentTranslateX.set(showMiddlePane);
  }

  private clampTranslateX(translateX: number) {
    const { showLeftPane, showRightPane } = this.getPaneTranslatePositions();
    return Math.min(showLeftPane, Math.max(showRightPane, translateX));
  }

  private getPaneTranslatePositions() {
    return {
      showMiddlePane: 0,
      showLeftPane: this.viewportWidth() * 0.2,
      showRightPane: this.viewportWidth() * -0.7,
    };
  }
}
