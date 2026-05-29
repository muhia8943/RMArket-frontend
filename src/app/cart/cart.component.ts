// cart.component.ts

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  cartItems: any[] = [];

  total = 0;



  /**
   * ================= MPESA POPUP =================
   */

  showMpesaPopup = false;

  mpesaPhone = "";



  constructor(
    private http: HttpClient
  ) {}



  ngOnInit(): void {

    this.getCart();
  }



  /**
   * ================= GET CART =================
   */

  getCart(){

    const userId =
      localStorage.getItem("userId");



    if(!userId){

      alert("Please login first");

      return;
    }



    this.http.get<any[]>(

      `https://rmarket-backend.onrender.com/api/orders/cart/${userId}`

    ).subscribe({

      next: (res) => {

        this.cartItems = res;



        if(this.cartItems.length > 0){

          this.total =
            this.cartItems[0].TotalAmount;
        }
      },

      error: () => {

        console.log(
          "Failed to load cart"
        );
      }
    });
  }



  /**
   * ================= INCREASE QTY =================
   */

  increaseQty(item: any){

    const payload = {

      orderId:
        item.OrderID,

      itemId:
        item.ItemID,

      quantity:
        item.Quantity + 1
    };



    this.http.put(

      "https://rmarket-backend.onrender.com/api/orders/cart",

      payload

    ).subscribe({

      next: () => {

        item.Quantity++;

        this.getCart();
      },

      error: () => {

        alert(
          "Failed to update quantity"
        );
      }
    });
  }



  /**
   * ================= DECREASE QTY =================
   */

  decreaseQty(item: any){

    if(item.Quantity <= 1)
      return;



    const payload = {

      orderId:
        item.OrderID,

      itemId:
        item.ItemID,

      quantity:
        item.Quantity - 1
    };



    this.http.put(

      "https://rmarket-backend.onrender.com/api/orders/cart",

      payload

    ).subscribe({

      next: () => {

        item.Quantity--;

        this.getCart();
      },

      error: () => {

        alert(
          "Failed to update quantity"
        );
      }
    });
  }



  /**
   * ================= REMOVE ITEM =================
   */

  removeItem(item: any){

    const payload = {

      orderId:
        item.OrderID,

      itemId:
        item.ItemID
    };



    this.http.delete(

      "https://rmarket-backend.onrender.com/api/orders/cart",

      {
        body: payload
      }

    ).subscribe({

      next: () => {

        this.cartItems =
          this.cartItems.filter(

            x =>
              x.ItemID !== item.ItemID
          );

        this.getCart();
      },

      error: () => {

        alert(
          "Failed to remove item"
        );
      }
    });
  }



  /**
   * ================= CHECKOUT =================
   */

  checkout(method: string){

    const userId =
      localStorage.getItem("userId");



    if(!userId){

      alert("Please login");

      return;
    }



    /**
     * ================= MPESA =================
     */

    if(method === "MPESA"){

      this.showMpesaPopup = true;

      return;
    }



    /**
     * ================= PAY ON DELIVERY =================
     */

    this.http.post(

      "https://rmarket-backend.onrender.com/api/orders/checkout",

      {
        userId,
        paymentMethod: method
      }

    ).subscribe({

      next: () => {

        alert(
          "Order placed successfully"
        );

        this.cartItems = [];

        this.total = 0;
      },

      error: (err) => {

        alert(

          err.error.message ||

          "Checkout failed"
        );
      }
    });
  }



  /**
   * ================= MPESA PAYMENT =================
   */

confirmMpesaPayment(){

  const userId =
    localStorage.getItem("userId");



  if(!this.mpesaPhone){

    alert(
      "Enter phone number"
    );

    return;
  }



  /**
   * ================= CLEAN NUMBER =================
   */

  const phone =
    this.mpesaPhone.trim();



  /**
   * ================= VALIDATE =================
   */

  if(
    !phone.startsWith("254") ||
    phone.length !== 12
  ){

    alert(
      "Use format: 2547XXXXXXXX"
    );

    return;
  }



  /**
   * ================= API =================
   */

  this.http.post(

    "http://localhost:3000/api/orders/checkout",

    {
      userId,
      paymentMethod: "MPESA",
      phone
    }

  ).subscribe({

    next: (res: any) => {

      console.log(res);



      alert(
        "STK Push sent. Check your phone."
      );



      this.showMpesaPopup = false;

      this.mpesaPhone = "";



      this.cartItems = [];

      this.total = 0;
    },

    error: (err) => {

      alert(

        err.error.message ||

        "M-Pesa payment failed"
      );
    }
  });
}
}