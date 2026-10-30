import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  template: `
    <div class="not-found">
      <h1>404</h1>
      <p>The page you are looking for does not exist.</p>
      <a routerLink="/">Back to search</a>
    </div>
  `,
  styles: [`
    .not-found {
      text-align: center;
      padding: 80px 24px;
      h1 { font-size: 64px; margin: 0 0 16px; color: var(--text); }
      p { color: var(--text-muted); font-size: 18px; }
      a { color: var(--primary); font-weight: 600; }
    }
  `],
})
export class NotFoundComponent {}
