import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category: string;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://rmarket-backend.onrender.com/api/items';

  constructor(private http: HttpClient) {}

  // ✅ FIX: map item_id → id
  getProducts(): Observable<Product[]> {
  return this.http.get<any>(this.apiUrl).pipe(
    map(res => {
      return res.data.map((item: any) => ({
        id: item.ItemID, // 🔥 THIS IS THE FIX
        name: item.name,
        description: item.description,
        price: item.price,
        stock_quantity: item.stock_quantity,
        category: item.category,
        image: item.image
      }));
    })
  );
}

  addProduct(product: Product) {
    return this.http.post(this.apiUrl, product);
  }

  updateProduct(id: number, product: Product) {
    return this.http.put(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}