import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CacheService {
  private readonly storage: Storage;

  constructor() {
    this.storage = window.localStorage;
  }

  getItem(key: string): string | null {
    try {
      return this.storage.getItem(key);
    } catch {
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      this.storage.setItem(key, value);
    } catch {
      // Storage might be full or unavailable (private mode); fail silently.
    }
  }

  removeItem(key: string): void {
    try {
      this.storage.removeItem(key);
    } catch {
      // Ignore storage access errors.
    }
  }

  clear(): void {
    try {
      this.storage.clear();
    } catch {
      // Ignore storage access errors.
    }
  }
}
