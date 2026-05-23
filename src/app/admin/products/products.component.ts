import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../../../services/product.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    HttpClientModule,
    CommonModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  /**
   * ================= PRODUCTS =================
   */

  products: Product[] = [];

  filteredProducts: Product[] = [];



  /**
   * ================= SEARCH =================
   */

  searchText: string = '';



  /**
   * ================= SELECTED PRODUCT =================
   */

  selectedProduct!: Product;



  /**
   * ================= ADD PRODUCT POPUP =================
   */

  showAddPopup = false;



  /**
   * ================= NEW PRODUCT =================
   */

  newProduct: Product = {

    name: '',

    description: '',

    price: null as any,

    stock_quantity: null as any,

    category: '',

    image: ''
  };



  constructor(
    private productService: ProductService
  ) {}



  /**
   * ================= ON INIT =================
   */

  ngOnInit(): void {

    this.loadProducts();
  }



  /**
   * ================= LOAD PRODUCTS =================
   */

  loadProducts() {

    this.productService
      .getProducts()
      .subscribe({

        next: (data) => {

          console.log(
            'Products:',
            data
          );

          this.products = data;

          this.filteredProducts = data;
        },

        error: (err) => {

          console.error(
            'Error:',
            err
          );
        }
      });
  }



  /**
   * ================= SEARCH PRODUCTS =================
   */

  searchProducts() {

    const search =
      this.searchText.toLowerCase();

    this.filteredProducts =
      this.products.filter(product =>

        product.name
          .toLowerCase()
          .includes(search) ||

        product.category
          .toLowerCase()
          .includes(search) ||

        product.price
          .toString()
          .includes(search)

      );
  }



  /**
   * ================= ADD PRODUCT =================
   */

  addProduct() {

    this.productService
      .addProduct(this.newProduct)
      .subscribe({

        next: () => {

          this.loadProducts();

          this.resetForm();

          this.showAddPopup = false;

          alert(
            "Product added successfully"
          );
        },

        error: (err) => {

          console.error(err);

          alert(
            "Failed to add product"
          );
        }
      });
  }



  /**
   * ================= DELETE PRODUCT =================
   */

  onDelete(product: Product) {

    console.log(
      'Deleting:',
      product
    );



    if (!product || !product.id) {

      console.error(
        'Invalid product:',
        product
      );

      return;
    }



    if (
      confirm(
        `Delete "${product.name}"?`
      )
    ) {

      this.productService
        .deleteProduct(product.id)
        .subscribe({

          next: () => {

            console.log(
              'Deleted successfully'
            );

            this.loadProducts();
          },

          error: (err) => {

            console.error(
              'Delete failed:',
              err
            );
          }
        });
    }
  }



  /**
   * ================= EDIT PRODUCT =================
   */

  editProduct(product: Product) {

    this.selectedProduct = {
      ...product
    };
  }



  /**
   * ================= UPDATE PRODUCT =================
   */

  updateProduct() {

    if (!this.selectedProduct.id) {

      console.error(
        'No ID for update'
      );

      return;
    }



    this.productService
      .updateProduct(
        this.selectedProduct.id,
        this.selectedProduct
      )
      .subscribe({

        next: () => {

          this.loadProducts();

          this.selectedProduct =
            {} as Product;

          alert(
            "Product updated"
          );
        },

        error: (err) => {

          console.error(err);

          alert(
            "Update failed"
          );
        }
      });
  }



  /**
   * ================= RESET FORM =================
   */

  resetForm() {

    this.newProduct = {

      name: '',

      description: '',

      price: null as any,

      stock_quantity: null as any,

      category: '',

      image: ''
    };
  }

}