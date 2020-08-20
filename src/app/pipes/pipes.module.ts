import { NgModule } from '@angular/core';
import { ProductFilterPipe } from './product-filter.pipe';
import { UserFilterPipe } from './user-filter.pipe';
import { CategoryFilterPipe } from './category-filter.pipe';



@NgModule({
  declarations: [ProductFilterPipe, UserFilterPipe, CategoryFilterPipe],
  exports: [ProductFilterPipe, UserFilterPipe, CategoryFilterPipe]
})
export class PipesModule { }
