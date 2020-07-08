import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { OmdbModule, OmdbSearchModule, OmdbMovieInfoModule } from './omdb';
import config from './config';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    OmdbModule.forRoot(config.omdbApiKey),
    OmdbSearchModule,
    OmdbMovieInfoModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
