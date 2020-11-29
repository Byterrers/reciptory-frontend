import { Component, OnInit } from '@angular/core';

// Services.
import { UserInventoryService } from 'src/app/core/services/user-inventory.service';
import { RecipesService } from 'src/app/core/services/recipes.service';
import { StorageService } from 'src/app/core/services/storage.service';

// UI Components.
import { ToastController } from '@ionic/angular';
import { Utils } from 'src/app/common/utils';

@Component({
  selector: 'rc-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  userId: string;

  units = ['u', 'l', 'kg'];

  itemsFridge = [];
  itemsFreezer = [];
  itemsPantry = [];
  itemsOther = [];

  constructor(
    private userInventoryService: UserInventoryService,
    private recipesService: RecipesService,
    private storageService: StorageService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadStaticData();
    this.loadDynamicData();
  }

  loadStaticData() {
    this.userId = this.storageService.getUserInfo().userId;
  }

  loadDynamicData() {
    this.userInventoryService.getUsersInventoryByUserId(this.userId).subscribe(
      (res) => {
        this.itemsFridge = res.refrigerator.map((i) => {
          const { expirationDate, ...rest } = i;
          if (!expirationDate) {
            return i;
          } else {
            let expDate = expirationDate.split('-');
            expDate = expDate[1] + '-' + expDate[0] + '-' + expDate[2];

            Utils.checkExpirationDate(expDate);

            return {
              expirationDate: expDate,
              ...rest
            };
          }
        });
        this.itemsFreezer = res.freezer.map((i) => {
          const { expirationDate, ...rest } = i;
          if (!expirationDate) {
            return i;
          } else {
            let expDate = expirationDate.split('-');
            expDate = expDate[1] + '-' + expDate[0] + '-' + expDate[2];

            Utils.checkExpirationDate(expDate);

            return {
              expirationDate: expDate,
              ...rest
            };
          }
        });
        this.itemsPantry = res.pantry.map((i) => {
          const { expirationDate, ...rest } = i;
          if (!expirationDate) {
            return i;
          } else {
            let expDate = expirationDate.split('-');
            expDate = expDate[1] + '-' + expDate[0] + '-' + expDate[2];

            Utils.checkExpirationDate(expDate);

            return {
              expirationDate: expDate,
              ...rest
            };
          }
        });
        this.itemsOther = res.others.map((i) => {
          const { expirationDate, ...rest } = i;
          if (!expirationDate) {
            return i;
          } else {
            let expDate = expirationDate.split('-');
            expDate = expDate[1] + '-' + expDate[0] + '-' + expDate[2];

            Utils.checkExpirationDate(expDate);

            return {
              expirationDate: expDate,
              ...rest
            };
          }
        });
      },
      async (err) => {
        await this.presentErrorToast(err.error.message);
      }
    );
  }

  onReloadData(e) {
    if (e) {
      this.loadDynamicData();
    }
  }

  /* Extras */

  async presentErrorToast(error: string) {
    const toast = await this.toastController.create({
      message: error || 'Unnable to connect to the server',
      duration: 3000
    });
    toast.present();
  }
}
