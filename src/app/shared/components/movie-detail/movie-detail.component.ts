import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MovieInfo, MovieRating } from '../../../core/models/movie';

const NAVIGATION_BLACKLIST = ['N/A', '', null, undefined];

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss'],
})
export class MovieDetailComponent {
  readonly movie = input<MovieInfo>();
  readonly closeDetail = output<void>();

  detailSections(movie: MovieInfo): Array<{ label: string; value: string }> {
    if (!movie) {
      return [];
    }
    return [
      { label: 'Year', value: movie.Year },
      { label: 'Rated', value: movie.Rated },
      { label: 'Released', value: movie.Released },
      { label: 'Runtime', value: movie.Runtime },
      { label: 'Genre', value: movie.Genre },
      { label: 'Director', value: movie.Director },
      { label: 'Writer', value: movie.Writer },
      { label: 'Actors', value: movie.Actors },
      { label: 'Language', value: movie.Language },
      { label: 'Country', value: movie.Country },
      { label: 'Awards', value: movie.Awards },
      { label: 'Box Office', value: movie.BoxOffice ?? 'N/A' },
      { label: 'Production', value: movie.Production ?? 'N/A' },
      { label: 'IMDb Votes', value: movie.imdbVotes },
    ].filter((row) => !NAVIGATION_BLACKLIST.includes(row.value));
  }

  isPotentialNavigation(value: string | undefined): boolean {
    if (!value) {
      return false;
    }
    return /^https?:\/\//.test(value);
  }

  ratings(movie: MovieInfo): MovieRating[] {
    return movie?.Ratings ?? [];
  }
}
