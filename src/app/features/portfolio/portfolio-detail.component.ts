import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PortfolioService } from './services/portfolio.service';
import { Property } from './models/property.model';
import { SnackBarService } from '../../shared/snack-bar/snack-bar.service';

@Component({
  selector: 'app-portfolio-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './portfolio-detail.component.html',
  styleUrl: './portfolio-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(PortfolioService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(SnackBarService);

  protected readonly property = signal<Property | undefined>(undefined);
  protected readonly loading = signal<boolean>(true);
  protected readonly currentImageIndex = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    // Check if ID is empty or invalid
    if (!id || id.trim() === '' || id === 'null' || id === 'undefined') {
      this.handlePropertyNotFound('Invalid property ID');
      return;
    }

    this.service.getPropertyById(id).subscribe({
      next: (property: Property | undefined) => {
        if (!property) {
          this.handlePropertyNotFound(id);
        } else {
          this.property.set(property);
          this.loading.set(false);
        }
      },
      error: (error) => {
        this.handleServerError(id, error);
      }
    });
  }

  /**
   * Handle property not found - show notification and navigate back
   */
  private handlePropertyNotFound(id: string): void {
    this.loading.set(false);
    this.snackBar.warning(`Property with ID "${id}" not found`);
    this.router.navigate(['/portfolio/properties']);
  }

  /**
   * Handle server error - show notification and navigate back
   */
  private handleServerError(id: string, error: any): void {
    this.loading.set(false);
    const errorMessage = error?.message || 'Unknown server error';
    this.snackBar.error(`Unable to load property: ${errorMessage}`);
    this.router.navigate(['/portfolio/properties']);
  }

  openImageDialog(imageUrl: string): void {
    this.dialog.open(ImageDialogComponent, {
      data: { imageUrl },
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'image-dialog'
    });
  }

  previousImage(): void {
    const images = this.property()?.images;
    if (images && images.length > 0) {
      const currentIndex = this.currentImageIndex();
      this.currentImageIndex.set(
        currentIndex === 0 ? images.length - 1 : currentIndex - 1
      );
    }
  }

  nextImage(): void {
    const images = this.property()?.images;
    if (images && images.length > 0) {
      const currentIndex = this.currentImageIndex();
      this.currentImageIndex.set(
        currentIndex === images.length - 1 ? 0 : currentIndex + 1
      );
    }
  }

  goToImage(index: number): void {
    this.currentImageIndex.set(index);
  }

  /**
   * Handle edit property action
   * TODO: Implement property edit form/dialog
   */
  editProperty(): void {
    const property = this.property();
    if (property) {
      this.snackBar.info(`Edit functionality for "${property.address}" coming soon!`);
    }
  }
}

// Image Dialog Component
@Component({
  selector: 'app-image-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="image-dialog-container">
      <button mat-icon-button mat-dialog-close class="close-button">
        <mat-icon>close</mat-icon>
      </button>
      <img [src]="data.imageUrl" alt="Property image" />
    </div>
  `,
  styles: [`
    .image-dialog-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #000;
      padding: 2rem;

      img {
        max-width: 100%;
        max-height: 80vh;
        object-fit: contain;
      }

      .close-button {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(255, 255, 255, 0.9);
        z-index: 10;

        &:hover {
          background: white;
        }
      }
    }
  `]
})
export class ImageDialogComponent {
  readonly data = inject<{ imageUrl: string }>(MAT_DIALOG_DATA);
}
