import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {debounceTime, distinctUntilChanged, filter, map, startWith, switchMap, tap} from 'rxjs/operators';
import {MovieInfo, OmdbService, SearchResultItem} from '../../services/omdb.service';
import {Observable, of} from 'rxjs';

@Component({
  selector: 'app-omdb-search',
  templateUrl: './omdb-search.component.html',
  styleUrls: ['./omdb-search.component.scss']
})
export class OmdbSearchComponent implements OnInit {

  @Output() beforeSarch = new EventEmitter<void>();
  @Output() search = new EventEmitter<MovieInfo>();
  @Output() clear = new EventEmitter<void>();

  searchControl = new FormControl('', [
    Validators.required
  ]);

  searchResult$: Observable<SearchResultItem[]>;

  constructor(private omdbService: OmdbService) { }

  ngOnInit(): void {
    this.searchResult$ = this.searchControl.valueChanges.pipe(
      // startWith('terminator'),
      debounceTime(350),
      distinctUntilChanged(),
      filter(val => typeof val === 'string'),
      map(s => s.trim()),
      switchMap((s: string) => {
        return s.length >= 4 // Фильм "Lucy" 4 символа
          ? this.omdbService.search(s).pipe(map(res => res.Search))
          : of([]);
      })
    );
  }

  searchControlDisplayFn(moview: SearchResultItem): string {
    return moview ? moview.Title : null;
  }

  onSelection(movie: SearchResultItem): void {
    this.beforeSarch.emit();
    this.omdbService.getMovieInfo(movie.imdbID).subscribe(movieInfo => {
      this.search.emit(movieInfo);
    });
  }

  clearField(): void {
    this.searchControl.setValue('', { emitEvent: true });
    this.clear.emit();
  }

}
