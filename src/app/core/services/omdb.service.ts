import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {DEFAULT_OMDB_OPTIONS, OMDB_OPTIONS, OmdbOptions} from '../omdb-options';
import {MovieInfo, OmdbSearchResponse, SearchResultItem} from '../models/movie';
import {IStorage} from "../ports/storage.abstract";

export interface SearchResult {
  Search: SearchResultItem[];
  totalResults: number;
}

@Injectable({ providedIn: 'root' })
export class OmdbService {
  private readonly http = inject(HttpClient);
  private readonly cache = inject(IStorage);
  private readonly options: OmdbOptions = inject(OMDB_OPTIONS, { optional: true }) ?? DEFAULT_OMDB_OPTIONS;

  search(term: string, page = 1): Observable<SearchResult> {
    const url = this.buildUrl({ s: term, page });

    return this.cachedRequest<OmdbSearchResponse>(url, { allowNotFound: true }).pipe(
      map((response) => {
        if (this.isFailedResponse(response)) {
          return { Search: [], totalResults: 0 };
        }
        return {
          Search: (response.Search ?? []).map((item) => this.normalizeSearchItem(item)),
          totalResults: Number(response.totalResults) || 0,
        };
      }),
    );
  }

  getMovieInfo(imdbId: string): Observable<MovieInfo> {
    const url = this.buildUrl({ i: imdbId, plot: 'full' });
    return this.cachedRequest<MovieInfo>(url).pipe(
      map((movie) => (movie?.Poster?.toUpperCase() === 'N/A' ? { ...movie, Poster: undefined } : movie)),
    );
  }

  searchSuggestions(term: string, page = 1): Observable<SearchResultItem[]> {
    const url = this.buildUrl({ s: term, page });
    return this.cachedRequest<OmdbSearchResponse>(url).pipe(
      map((response) => (response.Search ?? []).map((item) => this.normalizeSearchItem(item))),
    );
  }

  private cachedRequest<T>(url: string, options: { allowNotFound?: boolean } = {}): Observable<T> {
    const cached = this.cache.getItem(url);
    if (cached) {
      return of(JSON.parse(cached) as T);
    }

    return this.http.get<T>(url).pipe(
      tap((response) => {
        if (!this.isFailedResponse(response)) {
          this.cache.setItem(url, JSON.stringify(response));
        }
      }),
      map((response) => {
        if (this.isFailedResponse(response) && !(options.allowNotFound && this.isNotFoundResponse(response))) {
          throw new Error(this.apiErrorMessage(response as { Error?: string }));
        }
        return response;
      }),
      catchError((error) => throwError(() => new Error(this.errorMessage(error)))),
    );
  }

  private buildUrl(params: Record<string, string | number>): string {
    const searchParams = new URLSearchParams();
    Object.entries({ ...params, apikey: this.options.apiKey }).forEach(([key, value]) => {
      searchParams.set(key, String(value));
    });
    return `${this.options.baseUrl}/?${searchParams.toString()}`;
  }

  private normalizeSearchItem(item: SearchResultItem): SearchResultItem {
    return {
      ...item,
      Poster: item.Poster?.toUpperCase() === 'N/A' ? '' : item.Poster,
      Year: String(item.Year ?? ''),
    };
  }

  private isNotFoundResponse(response: unknown): boolean {
    return typeof response === 'object' && response !== null && (response as { Error?: string }).Error === 'Movie not found!';
  }

  private isFailedResponse(response: unknown): boolean {
    return typeof response === 'object' && response !== null && 'Response' in response && (response as { Response: unknown }).Response === 'False';
  }

  private apiErrorMessage(response: { Error?: string }): string {
    return response.Error ?? 'The OMDb API reported an error.';
  }

  private errorMessage(error: unknown): string {
    if (typeof error === 'string') {
      return error;
    }
    if (error instanceof Error) {
      return error.message;
    }
    const body = (error as { error?: { Error?: string } })?.error;
    return body?.Error ?? 'Unexpected error during the request.';
  }
}
