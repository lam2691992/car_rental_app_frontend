import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { PostCarComponent } from './components/post-car/post-car.component';
import { NgZorroImportsModule } from 'src/app/NgZorroImportsModule';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { UpdateCarComponent } from './components/update-car/update-car.component';
import { SearchCarComponent } from './components/admin-search-car/search-car.component';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
@NgModule({
  declarations: [
    AdminDashboardComponent,
    PostCarComponent,
    UpdateCarComponent,
    SearchCarComponent,
    
    
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgZorroImportsModule,
    ReactiveFormsModule,
    FormsModule,
    NzModalModule,
    NzInputNumberModule,
    
  ],
})
export class AdminModule {}
