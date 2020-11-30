import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {OmdbModule, OmdbMovieInfoModule, OmdbSearchModule} from '@app/omdb';
import {HomeComponent} from '@app/pages/home/home.component';
import {MaterialModule} from '@app/material.module';
import config from '@app/config';

const routes: Routes = [
  {path: '', component: HomeComponent}
];

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    MaterialModule,
    OmdbModule.forRoot(config.omdbApiKey),
    OmdbSearchModule,
    OmdbMovieInfoModule
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
