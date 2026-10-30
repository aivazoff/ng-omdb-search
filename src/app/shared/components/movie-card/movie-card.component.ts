import { Component, input, output } from '@angular/core';
import { SearchResultItem } from '../../../core/models/movie';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent {
  readonly movie = input.required<SearchResultItem>();
  readonly selectMovie = output<SearchResultItem>();
}
