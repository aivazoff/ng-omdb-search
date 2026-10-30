import { InjectionToken } from '@angular/core';

export interface OmdbOptions {
  apiKey: string;
  baseUrl?: string;
}

export const OMDB_OPTIONS = new InjectionToken<OmdbOptions>('OMDB_OPTIONS');

export const DEFAULT_OMDB_OPTIONS: OmdbOptions = {
  apiKey: '30715de7',
  baseUrl: 'https://www.omdbapi.com',
};
