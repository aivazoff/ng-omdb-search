import {InjectionToken, NgModule} from '@angular/core';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import {HttpClientModule} from '@angular/common/http';
import {CacheService} from './services/cache.service';

export const API_KEY = new InjectionToken('OMDB_API_KEY');

@NgModule({
  declarations: [
  ],
  imports: [
    HttpClientModule
  ],
  exports: [
  ]
})
export class OmdbModule {
  static forRoot(apiKey: string): ModuleWithProviders {
    return {
      ngModule: OmdbModule,
      providers: [
        { provide: API_KEY, useValue: apiKey },
        { provide: Storage, useClass: CacheService }
      ]
    };
  }
}
