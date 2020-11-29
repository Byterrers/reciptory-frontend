import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';

// Services.
import { MediatorService } from '../../core/services/mediator.service';
import { StorageService } from '../../core/services/storage.service';
import { LoginService } from '../../core/services/login.service';
import { UserInfoService } from '../../core/services/user-info.service';
import { RecipesService } from '../../core/services/recipes.service';

// Entities.
import { UserInfo } from 'src/app/core/entities/user-info.class';
import { Preference } from 'src/app/core/entities/preference.class';
import { Allergy } from 'src/app/core/entities/allergy.class';

// UI Components.
import { RecipeFormComponent } from './tabs-components/recipe-form/recipe-form.component';
import { ProductFormComponent } from './tabs-components/product-form/product-form.component';
import { RcScannerOcrComponent } from './tabs-components/rc-scanner-ocr/rc-scanner-ocr.component';
import { ProfileFormComponent } from './tabs-components/profile-form/profile-form.component';
import { RecipesBookFormComponent } from './tabs-components/recipes-book-form/recipes-book-form.component';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss']
})
export class TabsPage implements OnInit {
  loggedUserInfoId: string;
  loggedUserId: string;
  loggedUserPreferences: Preference[];
  loggedUserAllergies: Allergy[];
  preferences: Preference[];
  allergies: Allergy[];

  constructor(
    private readonly mediatorService: MediatorService,
    private readonly storageService: StorageService,
    private readonly loginService: LoginService,
    private readonly userInfoService: UserInfoService,
    private readonly recipesService: RecipesService,
    private readonly router: Router,
    private readonly actionSheetController: ActionSheetController,
    private readonly modalController: ModalController
  ) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const userInfo = this.storageService.getUserInfo();
    this.loggedUserInfoId = userInfo.id;
    this.loggedUserId = userInfo.userId;
    this.loggedUserPreferences = userInfo.preferences;
    this.loggedUserAllergies = userInfo.allergies;
    this.loadPreferences();
    this.loadAllergies();
  }

  loadPreferences() {
    this.recipesService.getPreferences().subscribe((res) => {
      this.preferences = res;
    });
  }

  loadAllergies() {
    this.recipesService.getAllergies().subscribe((res) => {
      this.allergies = res;
    });
  }

  /* Action Sheet */

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Reciptory actions',
      subHeader: 'Choose an action',
      mode: 'ios',
      buttons: [
        {
          text: 'Scanner',
          icon: 'camera',
          handler: async () => {
            await this.presentScannerModal();
            return true;
          }
        },
        {
          text: 'Recipes Book',
          icon: 'book',
          handler: async () => {
            await this.presentRecipesBookModal();
            return true;
          }
        },
        {
          text: 'Recipe',
          icon: 'list-box',
          handler: async () => {
            await this.presentRecipeModal();
            return true;
          }
        },
        {
          text: 'Product',
          icon: 'nutrition',
          handler: async () => {
            await this.presentProductModal();
            return true;
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  /* Scanner */

  async presentScannerModal() {
    const modal = await this.modalController.create({
      component: RcScannerOcrComponent
    });

    await modal.present();
  }

  /* Recipes Book */

  async presentRecipesBookModal() {
    const modal = await this.modalController.create({
      component: RecipesBookFormComponent,
      componentProps: {
        insert: true
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      if (data.reloadData) {
        this.mediatorService.mediator = 'recipesBook';
      }
    }
  }

  /* Recipes */

  async presentRecipeModal() {
    const modal = await this.modalController.create({
      component: RecipeFormComponent,
      componentProps: {
        insert: true
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      if (data.reloadData) {
        this.mediatorService.mediator = 'recipe';
        this.mediatorService.mediator = 'recipesBook';
      }
    }
  }

  /* Products */

  async presentProductModal() {
    const modal = await this.modalController.create({
      component: ProductFormComponent,
      componentProps: {
        multiple: false
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      if (data.reloadData) {
        this.mediatorService.mediator = 'inventory';
      }
    }
  }

  /* Community */

  onCommunity() {
    this.mediatorService.mediator = 'community';
  }

  /* Profile */

  async presentEditProfileModal() {
    const modal = await this.modalController.create({
      component: ProfileFormComponent
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      if (data.reloadData) {
        this.mediatorService.mediator = 'userInfo';
      }
    }
  }

  onProfile() {
    this.mediatorService.mediator = 'profile';
  }

  /* Preferences & Allergies */

  onPreferenceChange(e) {
    this.loggedUserPreferences = e.detail.value;
    this.updateUserInfo();
  }

  onAllergyChange(e) {
    this.loggedUserAllergies = e.detail.value;
    this.updateUserInfo();
  }

  compareWith(a, b) {
    return a && b ? a.id === b.id : false;
  }

  /* Update user's info */

  updateUserInfo() {
    const updatedLoggedUserInfo = {
      id: this.loggedUserInfoId,
      userId: this.loggedUserId,
      username: null,
      name: null,
      gender: null,
      country: null,
      city: null,
      avatar: null,
      preferences: this.loggedUserPreferences,
      allergies: this.loggedUserAllergies,
      userShoppingLists: null,
      following: null,
      followers: null
    } as UserInfo;
    this.userInfoService
      .updateUserInfo(this.loggedUserInfoId, updatedLoggedUserInfo)
      .subscribe((res) => {
        this.storageService.setUserInfo(res);
        this.mediatorService.mediator = 'userInfo';
      });
  }

  /* Log out */

  onLogout() {
    this.loginService.logout();
    this.router.navigate(['login']);
  }
}
