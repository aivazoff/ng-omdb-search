import {Component, OnInit} from '@angular/core';
import {MovieInfo, OmdbService, SearchResultItem} from './omdb/services/omdb.service';
import {FormControl, Validators} from '@angular/forms';
import {debounceTime, distinctUntilChanged, filter, map, startWith, switchMap, tap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';

interface TableRow {
  header: string;
  value: string|number;
  html?: boolean;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  searchControl = new FormControl('', [
    Validators.required
  ]);

  searchResult$: Observable<SearchResultItem[]>;
  displayedColumns = ['header', 'value'];
  tableRows: Array<TableRow> = [];
  movieInfo: MovieInfo;

  constructor(private omdbService: OmdbService) {
  }

  ngOnInit(): void {
    this.searchResult$ = this.searchControl.valueChanges.pipe(
      // startWith('terminator'),
      debounceTime(350),
      distinctUntilChanged(),
      filter(val => typeof val === 'string'),
      tap(() => {
        this.movieInfo = null;
        this.tableRows = [];
      }),
      switchMap((s: string) => {
        console.log(s);
        return (s || '').trim().length > 5
          ? this.omdbService.search(s).pipe(map(res => res.Search))
          : of([]);
      })
    );
  }

  searchControlDisplayFn(moview: SearchResultItem): string {
    return moview ? moview.Title : null;
  }

  onSelection(moview: SearchResultItem): void {
    this.omdbService.getMovieInfo(moview.imdbID).subscribe(movieInfo => {
      this.movieInfo = movieInfo;

      this.tableRows = [
        {header: 'Language', value: movieInfo.Language},
        {header: 'Director', value: movieInfo.Director},
        {header: 'Writer', value: movieInfo.Writer},
        {header: 'Actors', value: movieInfo.Actors},
        {header: 'DVD', value: movieInfo.DVD || ''},
        {header: 'BoxOffice', value: movieInfo.BoxOffice || ''},
        {header: 'Production', value: movieInfo.Production || ''},
        {header: 'Website', value: movieInfo.Website || ''},
      ];

    });
  }
}
