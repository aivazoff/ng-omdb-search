import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    window.localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to light theme when nothing is stored', () => {
    expect(service.theme()).toBe('light');
  });

  it('should toggle the theme', () => {
    const initial = service.theme();
    service.toggleTheme();
    expect(service.theme()).not.toBe(initial);
  });

  it('should persist the theme to localStorage', async () => {
    service.toggleTheme();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(window.localStorage.getItem('omdb-theme')).toBe(service.theme());
  });

  it('should apply the theme to the document element', async () => {
    service.toggleTheme();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(document.documentElement.getAttribute('data-theme')).toBe(service.theme());
  });
});
