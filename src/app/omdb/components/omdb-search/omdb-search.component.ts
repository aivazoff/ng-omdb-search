import {Component, OnInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {debounceTime, distinctUntilChanged, filter, map, startWith, switchMap, takeUntil, tap} from 'rxjs/operators';
import {OmdbService, SearchResult, SearchResultItem} from '../../services/omdb.service';
import {Observable, of, Subject} from 'rxjs';
import {AppValidators} from '../../../validators';

@Component({
  selector: 'app-omdb-search',
  templateUrl: './omdb-search.component.html',
  styleUrls: ['./omdb-search.component.scss']
})
export class OmdbSearchComponent implements OnInit, OnDestroy {

  @Output() selection = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();

  // Фильм "Lucy" 4 символа
  minLen = 4;

  searchControl = new FormControl('', [
    Validators.required,
    Validators.minLength(this.minLen),
    AppValidators.noWhitespaceValidator
  ]);

  searchResult$: Observable<SearchResultItem[]>;
  private destroyed$ = new Subject();

  constructor(private omdbService: OmdbService) { }

  ngOnInit(): void {
    this.searchResult$ = this.searchControl.valueChanges.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      map(val => val.trim()),
      takeUntil(this.destroyed$),
      switchMap((s: string) => {
        return this.searchControl.valid
          ? this.omdbService.search(s).pipe(map(res => res.Search))
          : of([]);
      })
    );
  }

  onSelection(movie: SearchResultItem): void {
    this.selection.emit(movie.Title);
  }

  clearField(): void {
    this.searchControl.setValue('', { emitEvent: true });
    this.clear.emit();
  }

  search(): void {
    if (this.searchControl.valid) {
      this.selection.emit(this.searchControl.value.trim());
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
