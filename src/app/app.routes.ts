import { Routes } from '@angular/router';

import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './profile/login/login.component';
import { CartComponent } from './cart/cart.component';

import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { OrdersComponent } from './admin/orders/orders.component';
import { UsersComponent } from './admin/users/users.component';
import { ProductsComponent } from './admin/products/products.component';

import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [

  /* ================= PUBLIC ROUTES ================= */

  {
    path: '',
    component: LandingComponent
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'cart',
    component: CartComponent
  },



  /* ================= ADMIN ROUTES ================= */

  {
    path: 'admin',
    component: DashboardComponent,
    canActivate: [adminGuard]
  },

  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [adminGuard]
  },

  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [adminGuard]
  },

  {
    path: 'users',
    component: UsersComponent,
    canActivate: [adminGuard]
  },



  /* ================= INVALID ROUTES ================= */

  {
    path: '**',
    redirectTo: ''
  }

];