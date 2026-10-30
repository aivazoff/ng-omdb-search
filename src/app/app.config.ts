import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { OMDB_OPTIONS } from './core/omdb-options';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(
      [
        {
          path: '',
          title: 'OMDb Search',
          loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
        },
        {
          path: '**',
          title: 'Not found',
          loadComponent: () => import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
        },
      ],
      withViewTransitions(),
    ),
    provideAnimations(),
    {
      provide: OMDB_OPTIONS,
      useValue: { apiKey: environment.omdbApiKey, baseUrl: environment.omdbBaseUrl },
    },
  ],
};
