import { TestBed } from '@angular/core/testing';
import { CacheService } from './cache.service';

describe('CacheService', () => {
  let service: CacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CacheService);
    service.clear();
  });

  afterEach(() => {
    service.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store and retrieve values', () => {
    service.setItem('key', 'value');
    expect(service.getItem('key')).toBe('value');
  });

  it('should return null for missing keys', () => {
    expect(service.getItem('missing')).toBeNull();
  });

  it('should remove values', () => {
    service.setItem('key', 'value');
    service.removeItem('key');
    expect(service.getItem('key')).toBeNull();
  });

  it('should clear all values', () => {
    service.setItem('a', '1');
    service.setItem('b', '2');
    service.clear();
    expect(service.getItem('a')).toBeNull();
    expect(service.getItem('b')).toBeNull();
  });
});
