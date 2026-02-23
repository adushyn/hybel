import { SnackBarType } from './snack-bar-type.enum';

/**
 * Snack Bar Data Interface
 * Defines the structure of data passed to the snack bar component
 */
export interface SnackBarData {
  message: string;
  type: SnackBarType;
  duration?: number;
  showProgress?: boolean;
}
