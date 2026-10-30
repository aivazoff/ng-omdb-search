import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieDetailComponent } from './movie-detail.component';
import { MovieInfo } from '../../../core/models/movie';

const MOVIE_INFO: MovieInfo = {
  Title: 'Inception',
  Year: '2010',
  Rated: 'PG-13',
  Released: '16 Jul 2010',
  Runtime: '148 min',
  Genre: 'Action, Adventure, Sci-Fi',
  Director: 'Christopher Nolan',
  Writer: 'Christopher Nolan',
  Actors: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page',
  Plot: 'A thief who steals corporate secrets through dream-sharing technology.',
  Language: 'English, Japanese, French',
  Country: 'United States, United Kingdom',
  Awards: 'Won 4 Oscars.',
  Poster: 'https://example.com/inception.jpg',
  Ratings: [{ Source: 'Internet Movie Database', Value: '8.8/10' }],
  Metascore: '74',
  imdbRating: '8.8',
  imdbVotes: '2,500,000',
  imdbID: 'tt1375666',
  Type: 'movie',
  BoxOffice: '$292,576,195',
  Production: 'Warner Bros.',
};

describe('MovieDetailComponent', () => {
  let component: MovieDetailComponent;
  let fixture: ComponentFixture<MovieDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieDetailComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('movie', MOVIE_INFO);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the movie title', () => {
    const title = fixture.nativeElement.querySelector('.movie-detail__title');
    expect(title.textContent).toContain('Inception');
  });

  it('should render the plot', () => {
    const plot = fixture.nativeElement.querySelector('.movie-detail__plot');
    expect(plot.textContent).toContain('dream-sharing');
  });

  it('should render ratings', () => {
    const ratings = fixture.nativeElement.querySelectorAll('.movie-detail__ratings li');
    expect(ratings.length).toBe(1);
    expect(ratings[0].textContent).toContain('Internet Movie Database');
  });

  it('should emit closeDetail when close button clicked', () => {
    let closed = false;
    component.closeDetail.subscribe(() => (closed = true));

    fixture.nativeElement.querySelector('.movie-detail__close').click();
    expect(closed).toBe(true);
  });

  it('should filter out N/A values from facts', () => {
    fixture.componentRef.setInput('movie', { ...MOVIE_INFO, DVD: 'N/A', Website: 'N/A' });
    fixture.detectChanges();

    const facts = component.detailSections({ ...MOVIE_INFO, DVD: 'N/A', Website: 'N/A' });
    expect(facts.every((row) => row.value !== 'N/A')).toBe(true);
  });

  it('should detect links in fact values', () => {
    expect(component.isPotentialNavigation('https://example.com')).toBe(true);
    expect(component.isPotentialNavigation('Action')).toBe(false);
  });

  it('should not render anything when movie is undefined', () => {
    fixture.componentRef.setInput('movie', undefined);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.movie-detail')).toBeNull();
  });
});
