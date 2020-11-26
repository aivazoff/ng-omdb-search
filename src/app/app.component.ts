import {Component, Inject, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MovieInfo, OmdbService, SearchResultItem} from './omdb/services/omdb.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {takeUntil} from 'rxjs/operators';
import {fromEvent, Subject} from 'rxjs';
import {DOCUMENT} from '@angular/common';

type SearchResultList = Array<SearchResultItem>;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  dataSource: MatTableDataSource<SearchResultItem>;
  displayedColumns: string[] = ['poster', 'title'];
  private destroyed$ = new Subject();
  totalResults: number;
  movieInfo: MovieInfo;
  searchValue: string;
  hiddenTable = true;
  loading = false;
  pageSize = 10;
  lastScrollTop = 0;

  private _searchResult: SearchResultList;
  get searchResult(): SearchResultList {
    return this._searchResult;
  }
  set searchResult(searchResult: SearchResultList) {
    this._searchResult = searchResult;
    this.scrollToTop();
  }

  constructor(
    private omdbService: OmdbService,
    private zone: NgZone,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      fromEvent(this.document, 'scroll')
        .pipe(takeUntil(this.destroyed$))
        .subscribe(e => {
          if (!this.hiddenTable) {
            this.lastScrollTop = this.document.scrollingElement.scrollTop;
          }
        });
    });

    this.paginator.page
      .pipe(takeUntil(this.destroyed$))
      .subscribe((e: PageEvent) => {
        this.hiddenTable = true;
        this.loading = true;

        this.omdbService.search(this.searchValue, e.pageIndex + 1)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(result => {
            this.totalResults = result.totalResults;
            this.searchResult = result.Search;
            this.hiddenTable = false;
            this.loading = false;
          });
      });
  }

  onSelect(value: string): void {
    this.searchValue = value;

    this.hiddenTable = true;
    this.loading = true;

    this.omdbService.search(value, 1)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(result => {
        this.paginator.firstPage();

        this.totalResults = result.totalResults;
        this.searchResult = result.Search;
        this.hiddenTable = false;
        this.movieInfo = null;
        this.loading = false;
      });
  }

  onClear(): void {
    this.hiddenTable = true;
    this.searchResult = null;
    this.totalResults = null;
  }

  showInfo({imdbID}): void {
    this.hiddenTable = true;
    this.loading = true;
    this.omdbService.getMovieInfo(imdbID)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(movieInfo => {
        this.movieInfo = movieInfo;
        this.loading = false;
      });
  }

  closeInfo(): void {
    this.hiddenTable = false;
    this.movieInfo = null;
    if (this.lastScrollTop) {
      setTimeout(() => {
        this.document.scrollingElement.scrollTop = this.lastScrollTop;
      });
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  private scrollToTop(): void {
    this.document.scrollingElement.scrollTop = 0;
  }
}
