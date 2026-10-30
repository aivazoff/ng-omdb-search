# OMDb Search

A cinematic movie search application built with Angular 22 and the [OMDb API](https://www.omdbapi.com).

![Angular](https://img.shields.io/badge/Angular-22-dd0031) ![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6) ![RxJS](https://img.shields.io/badge/RxJS-7.8-b7178c)

## Features

- **Live search** across the OMDb database with a 400 ms debounce and automatic cancellation of stale requests (`switchMap`).
- **Responsive poster grid** with adaptive columns for any screen size.
- **Detailed movie view** with plot, ratings (IMDb, Metacritic, Rotten Tomatoes), cast, awards and box office.
- **Pagination** for large result sets.
- **Light and dark themes** with automatic detection of the system preference and persistence in `localStorage`.
- **Client-side caching** of API responses in `localStorage` to minimize redundant requests.
- **Error handling** with user-friendly messages for failed requests and empty results.

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | Angular 22 (standalone components, signals, zoneless change detection) |
| Language | TypeScript 6.0 (strict mode) |
| Reactivity | RxJS 7.8 + Angular signals (`toSignal`, `computed`, `effect`) |
| UI | Angular Material 22 with a custom cinematic theme (SCSS + CSS custom properties) |
| Routing | Lazy-loaded standalone routes (`loadComponent`) |
| Testing | Karma + Jasmine |
| Linting | ESLint (flat config) + angular-eslint |
| Deployment | Firebase Hosting |

## Getting started

```bash
npm install
npm start          # dev server at http://localhost:4200
```

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the development server |
| `npm run build` | Production build (output in `dist/omdb-search`) |
| `npm test` | Run unit tests in watch mode |
| `npm run test:ci` | Run unit tests once (headless Chrome) |
| `npm run lint` | Lint sources with ESLint |
| `npm run deploy` | Build and deploy to Firebase Hosting |

## Project structure

```
src/app/
├── app.component.*            # App shell: toolbar, theme toggle, footer
├── app.config.ts              # Global providers (HTTP, router, animations, OMDb options)
├── core/
│   ├── models/movie.ts        # OMDb API types
│   ├── omdb-options.ts        # Injection token for API configuration
│   └── services/              # OmdbService, CacheService, ThemeService
├── pages/
│   ├── home/                  # Search page (lazy-loaded)
│   └── not-found/             # 404 page (lazy-loaded)
└── shared/components/
    ├── search-bar/            # Debounced search input
    ├── movie-card/            # Poster card for the results grid
    └── movie-detail/          # Movie details dialog
```

## OMDb API key

The application uses a demo OMDb API key. To use your own, set the `omdbApiKey` value in
`src/environments/environment.ts` (free keys are available at [omdbapi.com/apikey](https://www.omdbapi.com/apikey)).
