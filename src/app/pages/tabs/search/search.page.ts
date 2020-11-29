import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { PopoverController, IonRefresher } from '@ionic/angular';
import { Subscription } from 'rxjs/internal/Subscription';

// Services.
import { RecipesService } from 'src/app/core/services/recipes.service';
import { UserInfoService } from 'src/app/core/services/user-info.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { MediatorService } from 'src/app/core/services/mediator.service';

// Entities.
import { Recipe } from 'src/app/core/entities/recipe.class';
import { UserInfo } from 'src/app/core/entities/user-info.class';

// UI Components.
import { RcRecipeComponent } from 'src/app/components/rc-components/rc-recipe/rc-recipe.component';
import {
  IonSlides,
  ModalController,
  ToastController,
  IonSearchbar
} from '@ionic/angular';
import { SearchPopoverComponent } from './search-popover/search-popover.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss']
})
export class SearchPage implements OnInit, OnDestroy {
  @ViewChild('refresher', { static: true }) refresher: IonRefresher;
  @ViewChild('slides', { static: true }) slider: IonSlides;
  @ViewChild('searchBar', { static: true }) searchBar: IonSearchbar;

  userInfo: UserInfo;

  suggestedRecipesByName: Recipe[] = [];
  suggestedRecipesByIngredient: Recipe[] = [];
  followedProfiles: UserInfo[];
  searchedRecipesByName: Recipe[] = [];
  searchedRecipesByIngredient: Recipe[] = [];
  searchedProfiles: UserInfo[];

  recipesLoadedByName = false;
  recipesLoadedByIngredient = false;
  profilesLoaded = false;

  byInventory: boolean;
  byPreferences: boolean;
  byAllergies: boolean;

  segment = 0;

  subscription: Subscription;

  constructor(
    private readonly recipesService: RecipesService,
    private readonly userInfoService: UserInfoService,
    private readonly storageService: StorageService,
    private readonly mediatorService: MediatorService,
    private readonly modalController: ModalController,
    private readonly toastController: ToastController,
    private readonly popoverController: PopoverController
  ) {
    this.subscription = this.mediatorService
      .getMediatorEvent()
      .subscribe((e) => {
        switch (e) {
          case 'userInfo':
            this.clearData();
            this.loadData();
            break;
          case 'recipe':
            this.clearData();
            this.loadRecipesByName();
            break;
          case 'follow':
            this.clearData();
            this.loadProfiles();
            break;
          default:
            break;
        }
      });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData(complete?: boolean) {
    this.clearData();
    this.userInfo = this.storageService.getUserInfo();

    this.byInventory = this.storageService.getByInventory();
    this.byPreferences = this.storageService.getByPreferences();
    this.byAllergies = this.storageService.getByAllergies();

    if (complete) {
      this.loadRecipesByName(complete);
      this.loadRecipesByIngredients(complete);
      this.loadProfiles(complete);
    } else {
      this.loadRecipesByName();
      this.loadRecipesByIngredients();
      this.loadProfiles();
    }
  }

  loadRecipesByName(complete?: boolean) {
    this.recipesLoadedByName = false;
    this.recipesService
      .searchRecipeByName(
        '',
        this.byInventory,
        this.byPreferences,
        this.byAllergies,
        this.userInfo.userId
      )
      .subscribe(
        (res) => {
          this.suggestedRecipesByName = res as Recipe[];
          this.searchedRecipesByName = this.suggestedRecipesByName;
          setTimeout(() => (this.recipesLoadedByName = true));
          if (complete) {
            this.refresher.complete();
          }
        },
        async (err) => {
          await this.presentErrorToast(err.error.message);
        }
      );
  }

  loadRecipesByIngredients(complete?: boolean) {
    this.recipesLoadedByIngredient = false;
    this.recipesService.searchRecipeByIngredient('').subscribe((res) => {
      this.suggestedRecipesByIngredient = res as Recipe[];
      this.searchedRecipesByIngredient = this.suggestedRecipesByIngredient;
      setTimeout(() => (this.recipesLoadedByIngredient = true));
      if (complete) {
        this.refresher.complete();
      }
    });
  }

  loadProfiles(complete?: boolean) {
    this.profilesLoaded = false;
    this.userInfoService.getUserFollowing(this.userInfo.userId).subscribe(
      (res) => {
        this.followedProfiles = res;
        this.searchedProfiles = this.followedProfiles;
        setTimeout(() => (this.profilesLoaded = true));
        if (complete) {
          this.refresher.complete();
        }
      },
      async (err) => {
        await this.presentErrorToast(err.error.message);
      }
    );
  }

  /* Recipes */

  async presentRecipeModal(recipeId: string) {
    const modal = await this.modalController.create({
      component: RcRecipeComponent,
      componentProps: {
        recipeId
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data) {
      if (data.reloadData) {
        this.mediatorService.mediator = 'inventory';
        this.loadRecipesByName();
      }
    }
  }

  /* Search */

  onSearch(e) {
    if (e.detail.value) {
      this.searchByRecipe(e.detail.value);
      this.searchByIngredient(e.detail.value);
      this.searchUsers(e.detail.value);
    } else {
      this.searchedRecipesByName = this.suggestedRecipesByName;
      this.searchedRecipesByIngredient = this.suggestedRecipesByIngredient;
      this.searchedProfiles = this.followedProfiles;
    }
  }

  searchByRecipe(value: string) {
    this.recipesLoadedByName = false;
    this.recipesService
      .searchRecipeByName(
        value,
        this.byInventory,
        this.byPreferences,
        this.byAllergies,
        this.userInfo.userId
      )
      .subscribe(
        (res) => {
          this.searchedRecipesByName = res as Recipe[];
          setTimeout(() => (this.recipesLoadedByName = true));
        },
        async (err) => {
          await this.presentErrorToast(err.error.message);
        }
      );
  }

  searchByIngredient(value) {
    this.recipesLoadedByIngredient = false;
    this.recipesService.searchRecipeByIngredient(value).subscribe(
      (res) => {
        this.searchedRecipesByIngredient = res as Recipe[];
        setTimeout(() => (this.recipesLoadedByIngredient = true));
      },
      async (err) => {
        await this.presentErrorToast(err.error.message);
      }
    );
  }

  searchUsers(value) {
    this.profilesLoaded = false;
    this.userInfoService.searchUserInfo(value).subscribe(
      (res) => {
        this.searchedProfiles = res;
        setTimeout(() => (this.profilesLoaded = true));
      },
      async (err) => {
        await this.presentErrorToast(err.error.message);
      }
    );
  }

  async presentSearchPopover() {
    const popover = await this.popoverController.create({
      component: SearchPopoverComponent
    });
    await popover.present();

    const { data } = await popover.onWillDismiss();

    if (data) {
      if (data.reloadData) {
        this.loadData();
      }
    }
  }

  /* Segment/Slides */

  async segmentChanged() {
    await this.slider.slideTo(this.segment);
  }

  async slideChanged() {
    this.segment = await this.slider.getActiveIndex();
  }

  /* Extras */

  async presentErrorToast(error: string) {
    const toast = await this.toastController.create({
      message: error || 'Unnable to connect to the server',
      duration: 3000
    });
    toast.present();
  }

  refresh() {
    this.recipesLoadedByIngredient = false;
    this.recipesLoadedByName = false;
    this.profilesLoaded = false;
    this.loadData(true);
  }

  clearData() {
    if (this.searchBar) {
      this.searchBar.value = '';
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
