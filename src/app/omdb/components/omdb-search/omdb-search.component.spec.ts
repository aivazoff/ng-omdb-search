import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmdbSearchComponent } from './omdb-search.component';

describe('SearchComponent', () => {
  let component: OmdbSearchComponent;
  let fixture: ComponentFixture<OmdbSearchComponent>;

  beforeEach(async(() => {
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
