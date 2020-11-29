import {ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {MovieInfo, OmdbService, SearchResultItem} from './omdb/services/omdb.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {fromEvent, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {DOCUMENT} from '@angular/common';
import {OmdbSearchComponent} from './omdb/components/omdb-search/omdb-search.component';

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
    this.documentScrollTop = 0;
  }

  private get documentScrollTop(): number {
    return this.document.scrollingElement.scrollTop;
  }

  private set documentScrollTop(scrollTop: number) {
    this.document.scrollingElement.scrollTop = scrollTop;
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private omdbService: OmdbService,
    private zone: NgZone
  ) {
  }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      fromEvent(this.document, 'scroll')
        .pipe(takeUntil(this.destroyed$))
        .subscribe(() => {
          if (!this.hiddenTable) {
            this.lastScrollTop = this.documentScrollTop;
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
        setTimeout(() => {
          if (this.documentScrollTop > 0) {
            this.documentScrollTop = 0;
          }
        });
      });
  }

  closeInfo(): void {
    this.hiddenTable = false;
    this.movieInfo = null;
    if (this.lastScrollTop) {
      setTimeout(() => this.documentScrollTop = this.lastScrollTop);
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
