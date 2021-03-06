import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, tap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {OMDB_API_KEY} from '../omdb.module';

export interface SearchResultItem {
  Poster: string;
  Title: string;
  Type: string;
  Year: number;
  imdbID: string;
}

export interface SearchResult {
  Search: Array<SearchResultItem>;
  totalResults: number;
  Response: boolean;
}

export interface MovieRating {
  Source: string;
  Value: string;
}

export interface MovieInfo {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster?: string;
  Ratings: Array<MovieRating>;
  Metascore: string;
  imdbRating: number;
  imdbVotes: number;
  imdbID: string;
  Type: string;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
  totalSeasons: number;
}

@Injectable({
  providedIn: 'root'
})
export class OmdbService {

  constructor(
    @Inject(OMDB_API_KEY) private apiKey: string,
    private http: HttpClient,
    private cache: Storage
  ) {
  }

  search(s: string, page: number = 1): Observable<SearchResult> {

    return this.request<{

      Search: Array<SearchResultItem>;
      totalResults: number;
      Response: string;

    }>({s, page}).pipe(

        map(resp => ({
          Response: (resp.Response.toLocaleLowerCase() === 'true'),
          totalResults: resp.totalResults,
          Search: (resp.Search || []).map(movieInfo => {
            if ((movieInfo.Poster || '').toUpperCase() === 'N/A') {
              movieInfo.Poster = null;
            }
            return movieInfo;
          })
        }))

    );
  }

  getMovieInfo(imdbID: string): Observable<MovieInfo> {
    return this.request<MovieInfo>({i: imdbID}).pipe(
      map(movieInfo => {
        if ((movieInfo.Poster || '').toUpperCase() === 'N/A') {
          movieInfo.Poster = null;
        }
        return movieInfo;
      })
    );
  }

  private request<T>(params: {[key: string]: string | number}): Observable<T> {

    const url = `https://www.omdbapi.com/?${this.serialize({...params, apikey: this.apiKey})}`;

    if (this.cache.getItem(url)) {
      return of(JSON.parse(this.cache.getItem(url)) as T);
    }

    return this.http.get<T>(url)
      .pipe(
        tap(res => {
          this.cache.setItem(url, JSON.stringify(res));
        })
      );
  }

  private serialize(params: {[key: string]: string | number}): string {
    return Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
  }
}
