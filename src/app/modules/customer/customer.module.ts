import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';
import { NgZorroImportsModule } from 'src/app/NgZorroImportsModule';
import { BookCarComponent } from './components/book-car/book-car.component';
import { MyBookingsComponent } from './components/my-bookings/my-bookings.component';

import { SearchCarComponent } from './components/customer-search-car/search-car.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { GetBookingsComponent } from 'src/app/modules/admin/components/get-bookings/get-bookings.component';
// import { GetBookingsComponent } from 'src/app/modules/admin/components/get-bookings/get-bookings.component';

@NgModule({
  declarations: [
    CustomerDashboardComponent,
    BookCarComponent,
    MyBookingsComponent,
    GetBookingsComponent,
    SearchCarComponent,
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    NgZorroImportsModule,
    ReactiveFormsModule,
    FormsModule,
    NzGridModule,
    NzInputNumberModule,
  ],
})
export class CustomerModule {}
