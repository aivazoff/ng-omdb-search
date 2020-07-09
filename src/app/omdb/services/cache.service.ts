import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService implements Storage {
  private readonly storage: Storage;
  readonly length: number;
  [name: string]: any;

  constructor() {
    this.storage = window.localStorage;
  }

  getItem(key: string): string | null {
    return this.storage.getItem(key);
  }

  setItem(key: string, value: string): void {
    this.storage.setItem(key, value);
  }

  removeItem(key: string): void {
    this.storage.removeItem(key);
  }

  key(index: number): string | null {
    return this.storage.key(index);
  }

  clear(): void {
    this.storage.clear();
  }
}
