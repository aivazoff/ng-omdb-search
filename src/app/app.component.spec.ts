import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    window.localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([{ path: '', component: AppComponent }]),
        provideAnimations(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render the toolbar brand', () => {
    const brand = fixture.nativeElement.querySelector('.app-toolbar__title');
    expect(brand.textContent).toContain('OMDb');
  });

  it('should toggle the theme when the toggle button is clicked', () => {
    const initial = component.theme();
    const button = fixture.nativeElement.querySelector('.app-toolbar__theme-toggle');
    button.click();
    expect(component.theme()).not.toBe(initial);
  });
});
