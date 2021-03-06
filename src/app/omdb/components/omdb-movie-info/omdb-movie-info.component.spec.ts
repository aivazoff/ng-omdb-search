import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OmdbMovieInfoComponent } from './omdb-movie-info.component';

describe('MovieInfoComponent', () => {
  let component: OmdbMovieInfoComponent;
  let fixture: ComponentFixture<OmdbMovieInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OmdbMovieInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmdbMovieInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
