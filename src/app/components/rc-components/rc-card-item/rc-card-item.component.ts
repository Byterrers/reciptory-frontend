import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

// Services.
import { UserInventoryService } from 'src/app/core/services/user-inventory.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { ProductService } from 'src/app/core/services/product.service';
import { RecipesService } from 'src/app/core/services/recipes.service';

// Entities.
import { Product } from 'src/app/core/entities/product.class';
import { ProductDto } from 'src/app/core/entities/dtos/product.dto';

// UI Components.
import { AlertController, ToastController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';

// Extras.
import * as moment from 'moment';
import { Ingredient } from 'src/app/core/entities/ingredient.class';
import { Utils } from 'src/app/common/utils';

@Component({
  selector: 'rc-card-item',
  templateUrl: './rc-card-item.component.html',
  styleUrls: ['./rc-card-item.component.scss']
})
export class RcCardItemComponent implements OnInit {
  @Input() item: Product;
  @Input() units = [];
  @Input() openItem? = false;
  @Output() reloadData = new EventEmitter<boolean>();

  userId: string;

  ingredient: Ingredient;

  rangeMin = 0;
  rangeMax: number;

  today = moment(new Date()).format('YYYY-MM-DD');
  itemAboutToExpire = 1;

  ingredientsSubscription: Subscription;

  constructor(
    private readonly productService: ProductService,
    private readonly recipesService: RecipesService,
    private readonly userInventoryService: UserInventoryService,
    private readonly storageService: StorageService,
    private readonly alertController: AlertController,
    private readonly toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.userId = this.storageService.getUserInfo().userId;
    this.ingredient = this.item.ingredient;

    switch (this.item.unit) {
      case 'u':
        this.rangeMax = 50;
        break;
      case 'l':
        this.rangeMax = 20;
        break;
      case 'kg':
        this.rangeMax = 20;
        break;
    }

    this.itemAboutToExpire = Utils.checkExpirationDate(this.item.expirationDate);
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

  itemOnDisplay() {
    this.openItem = !this.openItem;
  }

  quantityUpdate(e) {
    this.item.quantity = e.detail.value;
  }

  unitUpdate(e) {
    this.item.unit = e.detail.value;
  }

  dateUpdate(e) {
    this.item.expirationDate = e.detail.value;
  }

  onUpdateProduct() {
    const product = {
      id: this.item.id,
      ingredient: this.ingredient,
      name: this.item.name,
      quantity: this.item.quantity,
      unit: this.item.unit,
      expirationDate: this.item.expirationDate
        ? moment(this.item.expirationDate).format('DD-MM-YYYY')
        : ''
    } as ProductDto;
    this.productService.updateProduct(product).subscribe(
      (res) => {
        this.reloadData.emit(true);
      },
      async (err) => {
        await this.presentErrorToast(err.error.message);
      }
    );
  }

  async onDeleteProduct() {
    await this.presentDeleteConfirm();
  }

  async presentDeleteConfirm() {
    const alert = await this.alertController.create({
      header: 'Delete product',
      message: 'Confirm removal',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: 'Accept',
          handler: () => {
            this.deleteProduct();
          }
        }
      ]
    });

    await alert.present();
  }

  deleteProduct() {
    this.productService.deleteUserProduct(this.userId, this.item.id).subscribe(
      (res) => {
        this.reloadData.emit(true);
      },
      async (err) => {
        await this.presentErrorToast(err.error.message);
      }
    );
  }

  moveTo(locationId: string) {
    this.userInventoryService
      .moveProduct(this.userId, this.item.id, locationId)
      .subscribe(
        (res) => {
          this.reloadData.emit(true);
        },
        async (err) => {
          await this.presentErrorToast(err.error.message);
        }
      );
  }

  async presentErrorToast(error: string) {
    const toast = await this.toastController.create({
      message: error ? error : 'Unnable to connect to the server',
      duration: 3000
    });
    toast.present();
  }
}
