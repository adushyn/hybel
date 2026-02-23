import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeNb from '@angular/common/locales/nb';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Register Norwegian locale
registerLocaleData(localeNb, 'nb-NO');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    { provide: LOCALE_ID, useValue: 'nb-NO' }
  ]
};
