import { Component, Inject, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SnackBarData } from './snack-bar.interface';
import { SnackBarType } from './snack-bar-type.enum';

/**
 * Custom Snack Bar Component
 * Displays notifications with different types (success, error, warning, info)
 */
@Component({
  selector: 'app-snack-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule
  ],
  templateUrl: './snack-bar.component.html',
  styleUrl: './snack-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SnackBarComponent implements OnInit, OnDestroy {
  message: string;
  type: SnackBarType;
  showProgress: boolean;
  progressValue = 100;
  isPinned = false;

  private progressInterval: any;
  private readonly defaultDuration = 5000; // 5 seconds

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackBarData,
    private snackBarRef: MatSnackBarRef<SnackBarComponent>
  ) {
    this.message = data.message;
    this.type = data.type;
    this.showProgress = data.showProgress !== false;
  }

  ngOnInit(): void {
    if (this.showProgress) {
      this.startProgress();
    }
  }

  ngOnDestroy(): void {
    this.clearProgress();
  }

  /**
   * Get icon based on snack bar type
   */
  getIcon(type: SnackBarType): string {
    switch (type) {
      case SnackBarType.SUCCESS:
        return 'check_circle';
      case SnackBarType.ERROR:
        return 'error';
      case SnackBarType.WARNING:
        return 'warning';
      case SnackBarType.INFO:
        return 'info';
      default:
        return '';
    }
  }

  /**
   * Pin/unpin the snack bar (stop auto-close)
   */
  pin(): void {
    this.isPinned = !this.isPinned;
    if (this.isPinned) {
      this.clearProgress();
      this.showProgress = false;
    } else {
      this.showProgress = true;
      this.progressValue = 100;
      this.startProgress();
    }
  }

  /**
   * Close the snack bar
   */
  close(): void {
    this.snackBarRef.dismiss();
  }

  /**
   * Start progress bar countdown
   */
  private startProgress(): void {
    const duration = this.data.duration || this.defaultDuration;
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    const decrementValue = 100 / steps;

    this.progressInterval = setInterval(() => {
      this.progressValue -= decrementValue;
      if (this.progressValue <= 0) {
        this.clearProgress();
        if (!this.isPinned) {
          this.close();
        }
      }
    }, interval);
  }

  /**
   * Clear progress interval
   */
  private clearProgress(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }
}
