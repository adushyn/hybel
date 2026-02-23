import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

/**
 * 404 Not Found Component
 * Displayed when user navigates to an invalid route
 */
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent {
  constructor(private router: Router) {}

  /**
   * Navigate back to home/dashboard
   */
  goHome(): void {
    this.router.navigate(['/portfolio']);
  }

  /**
   * Navigate back to previous page
   */
  goBack(): void {
    window.history.back();
  }
}
