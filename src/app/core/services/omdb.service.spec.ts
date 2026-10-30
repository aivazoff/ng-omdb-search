import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { OMDB_OPTIONS } from '../omdb-options';
import { OmdbService } from './omdb.service';
import { CacheService } from './cache.service';

describe('OmdbService', () => {
  let service: OmdbService;
  let httpMock: HttpTestingController;
  let cacheSpy: jasmine.SpyObj<CacheService>;

  beforeEach(() => {
    cacheSpy = jasmine.createSpyObj('CacheService', ['getItem', 'setItem', 'removeItem', 'clear']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: OMDB_OPTIONS, useValue: { apiKey: 'test-key', baseUrl: 'https://omdb.test' } },
        { provide: CacheService, useValue: cacheSpy },
      ],
    });

    service = TestBed.inject(OmdbService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('search', () => {
    it('should normalize a search response', () => {
      cacheSpy.getItem.and.returnValue(null);

      let result: { Search: unknown[]; totalResults: number } | undefined;
      service.search('inception', 1).subscribe((r) => (result = r));

      const req = httpMock.expectOne((r) => r.url.startsWith('https://omdb.test/'));
      const params = new URL(req.request.url).searchParams;
      expect(params.get('s')).toBe('inception');
      expect(params.get('page')).toBe('1');
      expect(params.get('apikey')).toBe('test-key');

      req.flush({
        Search: [
          { Title: 'Inception', Year: '2010', imdbID: 'tt1375666', Type: 'movie', Poster: 'N/A' },
        ],
        totalResults: '42',
        Response: 'True',
      });

      expect(result).toBeDefined();
      expect(result!.totalResults).toBe(42);
      expect(result!.Search[0]).toEqual(jasmine.objectContaining({ imdbID: 'tt1375666', Poster: '' }));
      expect(cacheSpy.setItem).toHaveBeenCalled();
    });

    it('should serve cached responses without an HTTP request', () => {
      const cached = JSON.stringify({
        Search: [{ Title: 'Cached Movie', Year: '2000', imdbID: 'tt0000001', Type: 'movie', Poster: 'x.jpg' }],
        totalResults: '1',
        Response: 'True',
      });
      cacheSpy.getItem.and.returnValue(cached);

      let result: { Search: unknown[]; totalResults: number } | undefined;
      service.search('cached', 1).subscribe((r) => (result = r));

      expect(result).toBeDefined();
      expect(result!.totalResults).toBe(1);
      httpMock.expectNone((r) => r.url.startsWith('https://omdb.test/'));
    });

    it('should return an empty result when no movies are found', () => {
      cacheSpy.getItem.and.returnValue(null);

      let result: { Search: unknown[]; totalResults: number } | undefined;
      service.search('nonexistent', 1).subscribe((r) => (result = r));

      const req = httpMock.expectOne((r) => r.url.startsWith('https://omdb.test/'));
      req.flush({ Response: 'False', Error: 'Movie not found!' }, { status: 200, statusText: 'OK' });

      expect(result).toBeDefined();
      expect(result!.Search).toEqual([]);
      expect(result!.totalResults).toBe(0);
    });

    it('should propagate API errors other than Movie not found', () => {
      cacheSpy.getItem.and.returnValue(null);

      let error: Error | undefined;
      service.search('boom', 1).subscribe({ error: (e: Error) => (error = e) });

      const req = httpMock.expectOne((r) => r.url.startsWith('https://omdb.test/'));
      req.flush({ Response: 'False', Error: 'API key limit reached' }, { status: 200, statusText: 'OK' });

      expect(error).toBeDefined();
      expect(error!.message).toContain('API key limit reached');
    });
  });

  describe('getMovieInfo', () => {
    it('should request full plot and normalize poster', () => {
      cacheSpy.getItem.and.returnValue(null);

      let info: { imdbID: string; Poster?: string } | undefined;
      service.getMovieInfo('tt1375666').subscribe((r) => (info = r));

      const req = httpMock.expectOne((r) => r.url.startsWith('https://omdb.test/'));
      const params = new URL(req.request.url).searchParams;
      expect(params.get('i')).toBe('tt1375666');
      expect(params.get('plot')).toBe('full');

      req.flush({
        Title: 'Inception',
        imdbID: 'tt1375666',
        Poster: 'N/A',
        Ratings: [],
        imdbRating: '8.8',
        imdbVotes: '2,000,000',
      });

      expect(info!.imdbID).toBe('tt1375666');
      expect(info!.Poster).toBeUndefined();
    });
  });
});
