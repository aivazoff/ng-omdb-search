import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OmdbMovieInfoComponent } from './omdb-movie-info.component';
import { MatTableModule } from '@angular/material/table';



@NgModule({
  declarations: [
    OmdbMovieInfoComponent
  ],
  imports: [
    CommonModule,
    MatTableModule
  ],
  exports: [
    OmdbMovieInfoComponent
  ]
})
export class OmdbMovieInfoModule { }
