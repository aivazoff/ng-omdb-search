import {Component, Inject, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, QueryParamsHandling, Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {DOCUMENT} from '@angular/common';
import {fromEvent, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {MovieInfo, OmdbService, SearchResultItem} from '@app/omdb/services/omdb.service';

type SearchResultList = Array<SearchResultItem>;

interface TableColumn {
  render: (item: SearchResultItem) => string;
  display?: boolean;
  name: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  dataSource: MatTableDataSource<SearchResultItem>;
  private destroyed$ = new Subject();
  totalResults: number;
  movieInfo: MovieInfo;
  searchValue: string;
  hiddenTable = true;
  loading = false;
  pageSize = 10;
  lastScrollTop = 0;

  tableColums: TableColumn[] = [
    {
      render: (item: SearchResultItem) => {
        const image = item.Poster ? `<img src="${item.Poster}" width="50">` : '';
        return `<div class="poster-cell">${image}</div>`;
      },
      name: 'Poster'
    },
    {
      render: (item: SearchResultItem) => item.Title,
      name: 'Title'
    }
  ];

  get displayedColumns(): string[] {
    return this.tableColums
      .filter(col => col.display !== false)
      .map(col => col.name);
  }

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
    private omdbService: OmdbService,
    @Inject(DOCUMENT) private document: Document,
    private activatedRoute: ActivatedRoute,
    private router: Router,
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

    this.activatedRoute.queryParams.subscribe((param: Params) => {
      const pageNumber = Number(param.p) || 1;
      this.paginator.pageIndex = pageNumber - 1;
      if (param.s) {
        this.search(param.s, pageNumber);
      } else {
        this.clear();
      }
    });

    this.paginator.page
      .pipe(takeUntil(this.destroyed$))
      .subscribe(e => {
        this.setNavigateQueryParams({p: e.pageIndex + 1}, 'merge');
      });
  }

  onSelect(value: string): void {
    this.setNavigateQueryParams({s: value, p: 1});
    this.movieInfo = null;
  }

  onClear(): void {
    this.setNavigateQueryParams({});
    this.clear();
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
      setTimeout(() => {
        this.documentScrollTop = this.lastScrollTop;
        this.lastScrollTop = 0;
      });
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  private setNavigateQueryParams(queryParams: Params, queryParamsHandling?: QueryParamsHandling): void {
    this.router.navigate([''], {queryParams, queryParamsHandling});
  }

  private search(searchValue: string, pageNumber?: number): void {
    this.searchValue = searchValue;
    this.hiddenTable = true;
    this.loading = true;

    this.omdbService
      .search(searchValue, pageNumber)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(result => {
        this.totalResults = result.totalResults;
        this.searchResult = result.Search;
        this.hiddenTable = false;
        this.loading = false;
        this.lastScrollTop = 0;
      });
  }

  private clear(): void {
    this.hiddenTable = true;
    this.searchResult = null;
    this.totalResults = null;
  }
}
