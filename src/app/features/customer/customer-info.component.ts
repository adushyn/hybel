import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { SnackBarService } from '../../shared/snack-bar/snack-bar.service';

/**
 * Customer Info Component
 * Displays standard user/customer information
 */
@Component({
  selector: 'app-customer-info',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './customer-info.component.html',
  styleUrl: './customer-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerInfoComponent {
  private readonly router = inject(Router);
  private readonly snackBar = inject(SnackBarService);

  /**
   * Profile photo URL signal
   */
  protected readonly profilePhoto = signal<string | null>(null);

  /**
   * Mock customer data - replace with actual data from service
   */
  protected readonly customerData = {
    name: 'Me name is Hybel',
    role: 'Property Owner',
    email: 'hybel@test.no',
    phone: '+47 123 45 678',
    address: 'Oslo, Norway',
    customerId: 'CUST-2024-001',
    memberSince: new Date('2024-01-15'),
    propertiesCount: 6,
    accountType: 'Premium',
    status: 'Active'
  };

  navigateToDashboard(): void {
    this.router.navigate(['/portfolio']);
  }

  /**
   * Trigger file input click
   */
  triggerFileInput(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  /**
   * Handle file selection
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.snackBar.error('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.error('File size must be less than 5MB');
        return;
      }

      // Read file and convert to data URL
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.profilePhoto.set(e.target.result as string);
          this.snackBar.success('Profile photo updated successfully');
        }
      };
      reader.readAsDataURL(file);
    }
  }
}
