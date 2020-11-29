import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { Subscription } from 'rxjs';

// Services.
import { ProductService } from 'src/app/core/services/product.service';
import { StorageService } from 'src/app/core/services/storage.service';

// Entities.
import { Product } from 'src/app/core/entities/product.class';
import { Ingredient } from 'src/app/core/entities/ingredient.class';
import { ProductDto } from 'src/app/core/entities/dtos/product.dto';

// UI Components.
import { ToastController, ModalController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';

// Extras.
import * as moment from 'moment';
import { RecipesService } from 'src/app/core/services/recipes.service';
import { MediatorService } from 'src/app/core/services/mediator.service';

@Component({
  selector: 'app-product',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  @Input() multiple: boolean;
  @Input() scannedProducts: any[] = [];

  productsForm: FormGroup;
  errorMessages: any;

  userId: string;
  productId: string = null;

  ingredients: [];

  ingredientsSubscription: Subscription;

  units = ['u', 'l', 'kg'];

  today = moment(new Date()).format('YYYY-MM-DD');

  place = 3;
  fridge = false;
  freezer = false;
  pantry = false;
  others = false;

  constructor(
    private readonly productService: ProductService,
    private readonly recipesService: RecipesService,
    private readonly storageService: StorageService,
    private readonly mediatorService: MediatorService,
    private readonly formBuilder: FormBuilder,
    private readonly modalController: ModalController,
    private readonly toastController: ToastController
  ) {}

  ngOnInit() {
    this.defineValidators();
    this.defineErrorMessages();
    this.loadData();
  }

  loadData() {
    this.userId = this.storageService.getUserInfo().userId;

    // this.recipesService.getIngredients().subscribe((res) => {
    //   this.ingredients = res;
    // });

    if (!this.multiple) {
      this.loadProductData();
    } else {
      this.loadProductsData();
    }
  }

  loadProductData() {}

  loadProductsData() {
    this.loadInputValues();
  }

  loadInputValues() {
    this.scannedProducts.forEach((p) => this.addProduct(p.quantity, p.name));
  }

  onSearchIngredients(event: {
    component: IonicSelectableComponent;
    text: string;
  }) {
    const text = event.text.trim().toLowerCase();
    event.component.startSearch();

    if (this.ingredientsSubscription) {
      this.ingredientsSubscription.unsubscribe();
    }

    if (!text) {
      if (this.ingredientsSubscription) {
        this.ingredientsSubscription.unsubscribe();
      }
      event.component.items = [];
      event.component.endSearch();
      return;
    }

    this.ingredientsSubscription = this.recipesService
      .searchIngredients(text)
      .subscribe((res) => {
        if (this.ingredientsSubscription.closed) {
          return;
        }
        event.component.items = this.filterIngredients(res, text);
        event.component.endSearch();
      });
  }

  filterIngredients(ingredients: Ingredient[], text: string) {
    return ingredients.filter((ingredient) => {
      return (
        ingredient.name.toLowerCase().indexOf(text) !== -1 ||
        ingredient.name.toLowerCase().indexOf(text) !== -1
      );
    });
  }

  /* Reactive form */

  defineValidators() {
    this.productsForm = this.formBuilder.group({
      products: !this.multiple
        ? this.formBuilder.array([
            this.formBuilder.group({
              name: this.formBuilder.control(
                '',
                Validators.compose([Validators.required])
              ),
              quantity: this.formBuilder.control(
                null,
                Validators.compose([Validators.required])
              ),
              unit: this.formBuilder.control(
                '',
                Validators.compose([Validators.required])
              ),
              ingredient: this.formBuilder.control(
                '',
                Validators.compose([Validators.required])
              ),
              expirationDate: this.formBuilder.control(
                '',
                Validators.compose([])
              )
            })
          ])
        : this.formBuilder.array([])
    });
  }

  get products() {
    return this.productsForm.get('products') as FormArray;
  }

  addProduct(quantity?, name?) {
    this.products.push(
      this.formBuilder.group({
        name: this.formBuilder.control(
          name ? name : '',
          Validators.compose([Validators.required])
        ),
        quantity: this.formBuilder.control(
          quantity ? quantity : null,
          Validators.compose([Validators.required])
        ),
        unit: this.formBuilder.control(
          '',
          Validators.compose([Validators.required])
        ),
        ingredient: this.formBuilder.control(
          null,
          Validators.compose([Validators.required])
        ),
        expirationDate: this.formBuilder.control('', Validators.compose([]))
      })
    );
  }

  removeProduct(i) {
    this.products.removeAt(i);
  }

  defineErrorMessages() {}

  async onSubmit() {
    if (!this.multiple) {
      this.createProduct();
    } else {
      await this.createProducts();
    }
  }

  createProduct() {
    const productDto = {
      ingredient: this.productsForm.value.products[0].ingredient,
      name: this.productsForm.value.products[0].name,
      quantity: this.productsForm.value.products[0].quantity,
      unit: this.productsForm.value.products[0].unit,
      expirationDate: this.productsForm.value.products[0].expirationDate
        ? moment(this.productsForm.value.products[0].expirationDate).format(
            'DD-MM-YYYY'
          )
        : ''
    } as ProductDto;
    this.productService
      .insertUserProduct(this.userId, productDto, this.place)
      .subscribe(
        async (res) => {
          this.mediatorService.mediator = 'inventory';
          this.modalController.dismiss(true);
        },
        async (err) => {
          await this.presentErrorToast(err.error.message);
        }
      );
  }

  async createProducts() {
    const products = (this.productsForm.value.products as Product[]).map(
      (p) => {
        const productDto = {
          ingredient: p.ingredient,
          name: p.name,
          quantity: p.quantity,
          unit: p.unit,
          expirationDate: p.expirationDate
            ? moment(p.expirationDate).format('DD-MM-YYYY')
            : ''
        } as ProductDto;
        return productDto;
      }
    );
    this.productService
      .insertUserScannedProducts(this.userId, products, this.place)
      .subscribe(
        async (res) => {
          this.mediatorService.mediator = 'inventory';
          await this.presentSuccessToast();
          this.modalController.dismiss(true);
        },
        async (err) => {
          await this.presentErrorToast(err.error.message);
        }
      );
  }

  /* Extras */

  placeUpdate(p) {
    switch (p) {
      case 0:
        this.fridge = true;
        this.freezer = false;
        this.pantry = false;
        this.others = false;
        break;
      case 1:
        this.fridge = false;
        this.freezer = true;
        this.pantry = false;
        this.others = false;
        break;
      case 2:
        this.fridge = false;
        this.freezer = false;
        this.pantry = true;
        this.others = false;
        break;
      case 3:
        this.fridge = false;
        this.freezer = false;
        this.pantry = false;
        this.others = true;
        break;
      default:
        break;
    }

    this.place = p;
  }

  async presentSuccessToast() {
    const toast = await this.toastController.create({
      message: 'Successfully added the scanned products to your inventory!',
      duration: 3000
    });
    toast.present();
  }

  async presentErrorToast(error: string) {
    const toast = await this.toastController.create({
      message: error || 'Unnable to connect to the server',
      duration: 3000
    });
    toast.present();
  }

  onClose() {
    this.modalController.dismiss(false);
  }
}
