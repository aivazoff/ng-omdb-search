import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EMPTY, Observable, Subject, catchError, map, switchMap, takeUntil, tap } from 'rxjs';
import { MovieInfo, SearchResultItem } from '../../core/models/movie';
import { OmdbService } from '../../core/services/omdb.service';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { MovieDetailComponent } from '../../shared/components/movie-detail/movie-detail.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';

export const PAGE_SIZE = 10;

interface SearchState {
  term: string;
  page: number;
  movies: SearchResultItem[];
  totalResults: number;
}

const EMPTY_STATE: SearchState = { term: '', page: 1, movies: [], totalResults: 0 };

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MovieCardComponent, MovieDetailComponent, SearchBarComponent, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatPaginatorModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnDestroy {
  readonly pageSize = PAGE_SIZE;

  private readonly omdbService = inject(OmdbService);
  private readonly query$ = new Subject<{ term: string; page: number }>();
  private readonly detailRequested$ = new Subject<string>();
  private readonly destroyed$ = new Subject<void>();

  readonly loading = signal(false);
  readonly loadingDetail = signal(false);
  readonly error = signal<string | null>(null);
  readonly state = signal<SearchState>(EMPTY_STATE);
  readonly movieInfo = signal<MovieInfo | null>(null);

  readonly totalResults = computed(() => this.state().totalResults);
  readonly movies = computed(() => this.state().movies);
  readonly searchTerm = computed(() => this.state().term);
  readonly currentPage = computed(() => this.state().page);
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalResults() / PAGE_SIZE)));

  constructor() {
    this.query$
      .pipe(switchMap(({ term, page }) => this.fetchPage(term, page)), takeUntil(this.destroyed$))
      .subscribe((state) => {
        if (state) {
          this.state.set(state);
        }
      });

    this.detailRequested$
      .pipe(switchMap((imdbId) => this.fetchDetail(imdbId)), takeUntil(this.destroyed$))
      .subscribe((movie) => {
        if (movie) {
          this.movieInfo.set(movie);
          this.loadingDetail.set(false);
        }
      });
  }

  onSearch(term: string): void {
    this.query$.next({ term, page: 1 });
  }

  onChangePage(page: number): void {
    const term = this.state().term;
    if (term) {
      this.query$.next({ term, page });
    }
  }

  onClearSearch(): void {
    this.state.set(EMPTY_STATE);
    this.error.set(null);
    this.movieInfo.set(null);
    this.loading.set(false);
    this.loadingDetail.set(false);
  }

  showInfo(movie: SearchResultItem): void {
    this.loadingDetail.set(true);
    this.movieInfo.set(null);
    this.detailRequested$.next(movie.imdbID);
  }

  closeInfo(): void {
    this.movieInfo.set(null);
    this.loadingDetail.set(false);
  }

  private fetchPage(term: string, page: number): Observable<SearchState> {
    this.loading.set(true);
    this.error.set(null);
    return this.omdbService.search(term, page).pipe(
      map((result) => ({ term, page, movies: result.Search, totalResults: result.totalResults })),
      tap(() => this.loading.set(false)),
      catchError((err: Error) => {
        this.loading.set(false);
        this.error.set(err.message);
        return EMPTY;
      }),
    );
  }

  private fetchDetail(imdbId: string): Observable<MovieInfo> {
    this.loadingDetail.set(true);
    this.movieInfo.set(null);
    return this.omdbService.getMovieInfo(imdbId).pipe(
      catchError((err: Error) => {
        this.loadingDetail.set(false);
        this.error.set(err.message);
        return EMPTY;
      }),
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
