import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HomeComponent } from './home.component';
import { OmdbService, SearchResult } from '../../core/services/omdb.service';
import { MovieInfo } from '../../core/models/movie';
import { provideAnimations } from '@angular/platform-browser/animations';

const MOCK_RESULT: SearchResult = {
  Search: [
    {
      Title: 'Inception',
      Year: '2010',
      imdbID: 'tt1375666',
      Type: 'movie',
      Poster: 'https://example.com/poster.jpg',
    },
  ],
  totalResults: 1,
};

const MOCK_INFO: MovieInfo = {
  Title: 'Inception',
  Year: '2010',
  Rated: 'PG-13',
  Released: '16 Jul 2010',
  Runtime: '148 min',
  Genre: 'Action, Adventure, Sci-Fi',
  Director: 'Christopher Nolan',
  Writer: 'Christopher Nolan',
  Actors: 'Leonardo DiCaprio',
  Plot: 'A thief who steals corporate secrets.',
  Language: 'English',
  Country: 'USA',
  Awards: 'Won 4 Oscars.',
  Poster: 'https://example.com/poster.jpg',
  Ratings: [],
  Metascore: '74',
  imdbRating: '8.8',
  imdbVotes: '2,500,000',
  imdbID: 'tt1375666',
  Type: 'movie',
};

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let omdbServiceSpy: jasmine.SpyObj<OmdbService>;

  beforeEach(async () => {
    omdbServiceSpy = jasmine.createSpyObj('OmdbService', ['search', 'getMovieInfo']);
    omdbServiceSpy.search.and.returnValue(of(MOCK_RESULT));
    omdbServiceSpy.getMovieInfo.and.returnValue(of(MOCK_INFO));

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: OmdbService, useValue: omdbServiceSpy },
        provideAnimations(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should search and update state', () => {
    component.onSearch('inception');
    fixture.detectChanges();

    expect(omdbServiceSpy.search).toHaveBeenCalledWith('inception', 1);
    expect(component.totalResults()).toBe(1);
    expect(component.movies().length).toBe(1);
    expect(component.movies()[0].Title).toBe('Inception');
  });

  it('should request the correct page', () => {
    component.onSearch('batman');
    component.onChangePage(3);
    fixture.detectChanges();

    expect(omdbServiceSpy.search).toHaveBeenCalledWith('batman', 3);
  });

  it('should fetch movie info when showInfo is called', () => {
    component.showInfo(MOCK_RESULT.Search[0]);
    fixture.detectChanges();

    expect(omdbServiceSpy.getMovieInfo).toHaveBeenCalledWith('tt1375666');
    expect(component.movieInfo()).toEqual(MOCK_INFO);
  });

  it('should clear state on clear search', () => {
    component.onSearch('inception');
    component.onClearSearch();

    expect(component.totalResults()).toBe(0);
    expect(component.movies().length).toBe(0);
    expect(component.searchTerm()).toBe('');
  });

  it('should handle search errors', () => {
    omdbServiceSpy.search.and.returnValue(throwError(() => new Error('Movie not found!')));

    component.onSearch('nonexistent');
    fixture.detectChanges();

    expect(component.error()).toContain('Movie not found!');
    expect(component.loading()).toBe(false);
    expect(component.movies().length).toBe(0);
  });

  it('should compute total pages', () => {
    omdbServiceSpy.search.and.returnValue(of({ Search: MOCK_RESULT.Search, totalResults: 42 }));
    component.onSearch('batman');
    fixture.detectChanges();

    expect(component.totalResults()).toBe(42);
    expect(component.totalPages()).toBe(5);
  });
});
