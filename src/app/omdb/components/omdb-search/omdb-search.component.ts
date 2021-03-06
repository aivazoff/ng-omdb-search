import {Component, OnInit, Output, EventEmitter, OnDestroy, Input} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {debounceTime, distinctUntilChanged, map, switchMap, takeUntil} from 'rxjs/operators';
import {OmdbService, SearchResultItem} from '../../services/omdb.service';
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
  @Input() set value(value: string) {
    if (this.searchControl.value !== value) {
      this.searchControl.setValue(value);
    }
  }
  minLen = 3;

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
      switchMap((s: string) => {
        return this.searchControl.valid
          ? this.omdbService.search(s).pipe(map(res => res.Search))
          : of([]);
      }),
      takeUntil(this.destroyed$)
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
