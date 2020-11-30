import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
  ]
})
export class MaterialModule {
}
