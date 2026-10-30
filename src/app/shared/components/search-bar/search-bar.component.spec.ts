import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit search on submit for valid input', () => {
    const emitted: string[] = [];
    component.submitSearch.subscribe((value) => emitted.push(value));

    component.term = 'inception';
    component.onSearch();

    expect(emitted).toEqual(['inception']);
  });

  it('should not emit search for short input', () => {
    const emitted: string[] = [];
    component.submitSearch.subscribe((value) => emitted.push(value));

    component.term = 'a';
    component.onSearch();

    expect(emitted).toEqual([]);
  });

  it('should clear the term and emit clearSearch', () => {
    let cleared = false;
    component.clearSearch.subscribe(() => (cleared = true));

    component.term = 'inception';
    component.onClear();

    expect(component.term).toBe('');
    expect(cleared).toBe(true);
  });

  it('should emit debounced valueChange when typing at least 2 chars (async)', async () => {
    const emitted: string[] = [];
    component.valueChange.subscribe((value) => emitted.push(value));

    component.onInput('inception');
    await new Promise((resolve) => setTimeout(resolve, 600));

    expect(emitted).toEqual(['inception']);
  });

  it('should not emit valueChange for short input (async)', async () => {
    const emitted: string[] = [];
    component.valueChange.subscribe((value) => emitted.push(value));

    component.onInput('a');
    await new Promise((resolve) => setTimeout(resolve, 600));

    expect(emitted).toEqual([]);
  });
});
