import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OmdbSearchComponent } from './omdb-search.component';

describe('SearchComponent', () => {
  let component: OmdbSearchComponent;
  let fixture: ComponentFixture<OmdbSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OmdbSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmdbSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
