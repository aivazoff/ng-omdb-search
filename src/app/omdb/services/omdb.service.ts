import {Injectable, Injector} from '@angular/core';
import {API_KEY} from '../omdb.module';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map, tap} from 'rxjs/operators';
import {CacheService} from './cache.service';

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
  Response: string;
}

@Injectable({
  providedIn: 'root'
})
export class OmdbService {
  private readonly apiKey: string;

  constructor(
    private injector: Injector,
    private http: HttpClient,
    private cache: Storage
  ) {
    this.apiKey = String(this.injector.get(API_KEY));
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
          Search: resp.Search
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

    let url = `http://www.omdbapi.com/?apikey=${this.apiKey}&`;
    url += Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&');

    if (this.cache.getItem(url)) {
      return of(JSON.parse(this.cache.getItem(url)) as T);
    }

    return this.http.get<T>(url).pipe(
      tap(res => {
        this.cache.setItem(url, JSON.stringify(res));
      })
    );
  }
}
