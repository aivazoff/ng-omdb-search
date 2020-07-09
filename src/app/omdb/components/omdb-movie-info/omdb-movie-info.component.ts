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


@Component({
  selector: 'app-omdb-info-card',
  template: `
    <div class="card margin-auto">
      <div class="row no-gutters">
        <div class="col-lg-4" *ngIf="image">
          <img [src]="image" [alt]="title" class="card-img">
        </div>
        <div [class]="'col-lg-'.concat(image ? '8' : '12')">
          <div class="card-body">
            <h1 class="card-title">{{ title }}</h1>
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OmdbInfoCardComponent {
  @Input() image: string;
  @Input() title: string;
}


@Component({
  selector: 'app-omdb-info-card-row',
  template: `<p class="card-text">
    <b>{{ title }}:</b> <small class="text-muted"><ng-content></ng-content></small>
  </p>`,
  styles: [`
    .card-text > b:first-child {
      margin-right: 10px;
      font-weight: 500;
    }
  `]
})
export class OmdbInfoCardRowComponent {
  @Input() title: string;
}
