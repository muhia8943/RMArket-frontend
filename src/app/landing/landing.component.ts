import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit {

  api = "https://rmarket-backend.onrender.com/api/items";

  items: any[] = [];
  allItems: any[] = []; // 🔥 backup for search

  categories: { [key: string]: any[] } = {};

  cartCount: number = 0;

  searchTerm: string = ""; // 🔥 search input

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getItems();
    this.getCartCount();
  }

  // ================= GET ALL ITEMS =================
  getItems(){

    this.http.get<any>(this.api).subscribe({

      next: (res) => {

        this.items = res.data;
        this.allItems = res.data; // 🔥 keep original

        this.groupByCategory();

      },

      error: () => {
        console.log("Failed to load items");
      }

    });

  }

  // ================= GROUP ITEMS BY CATEGORY =================
  groupByCategory(){

    this.categories = {};

    this.items.forEach(item => {

      if(!this.categories[item.category]){
        this.categories[item.category] = [];
      }

      this.categories[item.category].push(item);

    });

  }

  // ================= SEARCH FILTER =================
  filterItems(){

    if(!this.searchTerm){
      this.items = this.allItems;
    } else {

      const term = this.searchTerm.toLowerCase();

      this.items = this.allItems.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
      );

    }

    this.groupByCategory();

  }

  // ================= ADD TO CART =================
  addToCart(item:any){

    const userId = localStorage.getItem("userId");

    if(!userId || userId === "undefined"){
      alert("Please login first");
      this.router.navigate(['/login']);
      return;
    }

    const quantity = item.quantity ? Number(item.quantity) : 1;

    const payload = {
      userId: Number(userId),
      itemId: Number(item.ItemID),
      quantity: quantity
    };

    console.log("Sending cart request:", payload);

    this.http.post("https://rmarket-backend.onrender.com/api/orders/cart", payload)
    .subscribe({

      next: () => {
        alert("Item added to cart");
        this.getCartCount(); // 🔥 update badge
      },

      error: (err) => {
        console.error("Cart error:", err);
        alert("Failed to add item");
      }

    });

  }

  // ================= GET CART COUNT =================
  getCartCount(){

    const userId = localStorage.getItem("userId");

    if(!userId || userId === "undefined"){
      this.cartCount = 0;
      return;
    }

    this.http.get<any>(`https://rmarket-backend.onrender.com/api/orders/cart/${userId}`)
    .subscribe({

      next:(res)=>{

        // 🔥 FIX: your backend returns { success, data }
        this.cartCount = res.data.length;

      },

      error:()=>{
        console.log("Failed to load cart count");
      }

    });

  }

  // ================= LOGOUT =================
  logout(){

    localStorage.clear();

    alert("You are out.");

    this.cartCount = 0;

    this.router.navigate(['']);

  }

}