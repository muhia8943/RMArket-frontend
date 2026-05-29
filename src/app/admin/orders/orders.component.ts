import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {

  orders: any[] = [];
  filteredOrders: any[] = [];

  searchText: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {

    this.http.get<any[]>(
      'https://rmarket-backend.onrender.com/api/orders/admin/orders'
    ).subscribe({

      next: (res) => {
        this.orders = res;
        this.filteredOrders = res;
      },

      error: (err) => {
        console.log(err);
      }

    });

  }

  searchOrders() {

    const search = this.searchText.toLowerCase();

    this.filteredOrders = this.orders.filter(order =>

      order.OrderID.toString().includes(search) ||

      order.PaymentMethod.toLowerCase().includes(search)

    );

  }

}