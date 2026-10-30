import { Component, effect, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime, distinctUntilChanged, filter, map, Subject } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  readonly placeholder = input('Search for a movie, series or episode...');
  readonly loading = input(false);
  readonly valueChange = output<string>();
  readonly submitSearch = output<string>();
  readonly clearSearch = output<void>();

  term = '';
  private readonly input$ = new Subject<string>();

  private readonly debouncedTerm = toSignal(
    this.input$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map((value) => value.trim()),
      filter((value) => value.length >= 2),
    ),
  );

  constructor() {
    effect(() => {
      const value = this.debouncedTerm();
      if (value !== undefined) {
        this.valueChange.emit(value);
      }
    });
  }

  onInput(value: string): void {
    this.term = value;
    this.input$.next(value);
  }

  onSearch(): void {
    const value = this.term.trim();
    if (value.length >= 2) {
      this.submitSearch.emit(value);
    }
  }

  onClear(): void {
    this.term = '';
    this.input$.next('');
    this.clearSearch.emit();
  }
}
