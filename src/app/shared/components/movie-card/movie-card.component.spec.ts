import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieCardComponent } from './movie-card.component';
import { SearchResultItem } from '../../../core/models/movie';

const MOVIE: SearchResultItem = {
  Title: 'Inception',
  Year: '2010',
  imdbID: 'tt1375666',
  Type: 'movie',
  Poster: 'https://example.com/poster.jpg',
};

describe('MovieCardComponent', () => {
  let component: MovieCardComponent;
  let fixture: ComponentFixture<MovieCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('movie', MOVIE);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the movie title', () => {
    const titleEl = fixture.nativeElement.querySelector('.movie-card__title');
    expect(titleEl.textContent).toContain('Inception');
  });

  it('should emit selectMovie when clicked', () => {
    let selected: SearchResultItem | undefined;
    component.selectMovie.subscribe((movie) => (selected = movie));

    fixture.nativeElement.querySelector('.movie-card').click();

    expect(selected).toEqual(MOVIE);
  });

  it('should render a placeholder when poster is empty', () => {
    fixture.componentRef.setInput('movie', { ...MOVIE, Poster: '' });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.movie-card__placeholder')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('img')).toBeNull();
  });
});
