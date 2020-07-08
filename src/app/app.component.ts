import {Component, OnInit} from '@angular/core';
import {MovieInfo} from './omdb/services/omdb.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  movieInfo: MovieInfo;
  loading: boolean;

  constructor() {
  }

  ngOnInit(): void {
  }

  onSearch(movieInfo: MovieInfo): void {
    this.movieInfo = movieInfo;
    this.loading = false;
  }

  onClear(): void {
    this.movieInfo = null;
  }

  onBeforeSarch(): void {
    this.movieInfo = null;
    this.loading = true;
  }
}
