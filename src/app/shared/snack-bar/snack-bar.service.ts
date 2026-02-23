import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { SnackBarComponent } from './snack-bar.component';
import { SnackBarData } from './snack-bar.interface';
import { SnackBarType } from './snack-bar-type.enum';

/**
 * Snack Bar Service
 * Provides methods to display different types of notifications
 * Replaces native alert() with Material Design snack bars
 */
@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  private snackBarRef: MatSnackBarRef<SnackBarComponent> | null = null;

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Display error notification
   */
  error(message?: string, duration?: number): void {
    if (!message) {
      console.error('Tried to display error notification without a message');
      return;
    }
    this.openSnackBar({
      message,
      type: SnackBarType.ERROR,
      duration: duration || 6000, // Errors stay longer
      showProgress: true
    });
  }

  /**
   * Display success notification
   */
  success(message: string, duration?: number): void {
    this.openSnackBar({
      message,
      type: SnackBarType.SUCCESS,
      duration: duration || 4000,
      showProgress: true
    });
  }

  /**
   * Display warning notification
   */
  warning(message: string, duration?: number): void {
    this.openSnackBar({
      message,
      type: SnackBarType.WARNING,
      duration: duration || 5000,
      showProgress: true
    });
  }

  /**
   * Display info notification
   */
  info(message: string, duration?: number): void {
    this.openSnackBar({
      message,
      type: SnackBarType.INFO,
      duration: duration || 4000,
      showProgress: true
    });
  }

  /**
   * Display neutral notification (no icon)
   */
  neutral(message: string, duration?: number): void {
    this.openSnackBar({
      message,
      type: SnackBarType.NEUTRAL,
      duration: duration || 3000,
      showProgress: true
    });
  }

  /**
   * Open snack bar with custom data
   */
  private openSnackBar(data: SnackBarData): void {
    // Close existing snack bar if any
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }

    // Get CSS class based on type
    const panelClass = this.getPanelClass(data.type);

    // Open new snack bar
    this.snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      data,
      duration: 0, // We handle duration manually in component
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar', panelClass]
    });

    // Clear reference when dismissed
    this.snackBarRef.afterDismissed().subscribe(() => {
      this.snackBarRef = null;
    });
  }

  /**
   * Get CSS panel class based on snack bar type
   */
  private getPanelClass(type: SnackBarType): string {
    switch (type) {
      case SnackBarType.SUCCESS:
        return 'snack-success';
      case SnackBarType.ERROR:
        return 'snack-error';
      case SnackBarType.WARNING:
        return 'snack-warning';
      case SnackBarType.INFO:
        return 'snack-info';
      case SnackBarType.NEUTRAL:
        return 'snack-neutral';
      default:
        return 'snack-neutral';
    }
  }

  /**
   * Dismiss current snack bar
   */
  dismiss(): void {
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
  }
}
