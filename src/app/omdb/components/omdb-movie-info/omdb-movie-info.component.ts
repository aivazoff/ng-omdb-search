import {Component, Input, OnInit} from '@angular/core';
import {MovieInfo} from '../../services/omdb.service';

interface TableRow {
  header: string;
  value: string|number;
  html?: boolean;
}

@Component({
  selector: 'app-omdb-movie-info',
  templateUrl: './omdb-movie-info.component.html',
  styleUrls: ['./omdb-movie-info.component.scss']
})
export class OmdbMovieInfoComponent implements OnInit {

  private _movieInfo: MovieInfo;

  @Input()
  set movieInfo(movieInfo: MovieInfo) {
    this._movieInfo = movieInfo;

    this.tableRows = [
      {header: 'Language', value: movieInfo.Language},
      {header: 'Director', value: movieInfo.Director},
      {header: 'Writer', value: movieInfo.Writer},
      {header: 'Actors', value: movieInfo.Actors},
      {header: 'DVD', value: movieInfo.DVD || ''},
      {header: 'BoxOffice', value: movieInfo.BoxOffice || ''},
      {header: 'Production', value: movieInfo.Production || ''},
      {header: 'Website', value: movieInfo.Website || ''},
    ];
  }
  get movieInfo(): MovieInfo {
    return this._movieInfo;
  }

  displayedColumns = ['header', 'value'];
  tableRows: Array<TableRow>;

  constructor() { }

  ngOnInit(): void {
  }

}
