import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';

import {
  Camera,
  CameraOptions,
  PictureSourceType,
} from '@ionic-native/camera/ngx';

// Services.
import { MediatorService } from 'src/app/core/services/mediator.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { UserInfoService } from 'src/app/core/services/user-info.service';
import { RecipesService } from 'src/app/core/services/recipes.service';
import { RecipesBookService } from 'src/app/core/services/recipesBook.service';

// Entities.
import { UserInfo } from 'src/app/core/entities/user-info.class';
import { Recipe } from 'src/app/core/entities/recipe.class';
import { Preference } from 'src/app/core/entities/preference.class';
import { Allergy } from 'src/app/core/entities/allergy.class';

// UI Components.
import { RecipesBooksComponent } from './recipes-books/recipes-books.component';
import { RcRecipeComponent } from 'src/app/components/rc-components/rc-recipe/rc-recipe.component';
import { RecipeFormComponent } from '../tabs-components/recipe-form/recipe-form.component';
import {
  Platform,
  ToastController,
  ModalController,
  IonSlides,
} from '@ionic/angular';

// Extras.
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'home',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  @ViewChild('recipesBooks', { static: true })
  recipesBooks: RecipesBooksComponent;
  @ViewChild('slides', { static: true }) slider: IonSlides;
  loggedUserId: string;
  loggedUserInfo: UserInfo;

  userInfo: UserInfo;
  userId: string;

  recipes: Recipe[] = [];

  preferences: Preference[];
  allergies: Allergy[];

  isPrivate: boolean;

  followText: string;

  dataLoaded: boolean;

  subscription: Subscription;

  segment = 0;

  capturedSnapURL: string;
  cameraOptions: CameraOptions = {
    quality: 60,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true,
    saveToPhotoAlbum: true,
  };

  profileImage: any;
  profileImageUrl: string;

  isMobile: boolean;

  constructor(
    private readonly userInfoService: UserInfoService,
    private readonly recipesBookService: RecipesBookService,
    private readonly storageService: StorageService,
    private readonly mediatorService: MediatorService,
    private readonly activatedRoute: ActivatedRoute,
    private platform: Platform,
    private camera: Camera,
    private domSanitizer: DomSanitizer,
    private modalController: ModalController,
    private toastController: ToastController
  ) {
    this.subscription = this.mediatorService
      .getMediatorEvent()
      .subscribe((e) => {
        switch (e) {
          case 'profile':
            this.loadData();
            if (this.recipesBooks) {
              this.recipesBooks.loadData();
            }
            break;
          case 'userInfo':
          case 'recipe':
            this.loadData();
            break;
          case 'recipesBook':
            if (this.recipesBooks) {
              this.recipesBooks.loadData();
            }
            break;
          default:
            break;
        }
      });
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.platform.is('cordova')
        ? (this.isMobile = true)
        : (this.isMobile = false);
    });
    this.loadData();
  }

  loadData() {
    this.dataLoaded = false;
    this.loggedUserInfo = this.storageService.getUserInfo();
    this.loggedUserId = this.loggedUserInfo.userId;

    this.userId =
      this.activatedRoute.snapshot.paramMap.get('id') || this.loggedUserId;
    this.userId === this.loggedUserId
      ? (this.isPrivate = true)
      : (this.isPrivate = false);

    if (this.isPrivate) {
      this.userInfo = this.storageService.getUserInfo();
      this.loadRecipes();
    } else {
      this.userInfoService.getUserInfo(this.userId).subscribe(
        (res) => {
          this.userInfo = res;
          this.loadRecipes();
        },
        async (err) => {
          await this.presentErrorToast(err.error.message);
        }
      );

      const following = this.loggedUserInfo.following.find(
        (u) => u === this.userId
      );
      if (following) {
        this.followText = 'UNFOLLOW';
      } else {
        this.followText = 'FOLLOW';
      }
    }
  }

  loadRecipes() {
    this.recipesBookService
      .getUserFavoriteRecipesBookByUserId(this.userInfo.userId)
      .subscribe(
        (res) => {
          this.recipes = res.recipes as Recipe[];
          if (!this.isPrivate) {
            this.recipes = this.recipes.filter((r) => r.shared);
          }
          setTimeout(() => (this.dataLoaded = true));
        },
        async (err) => {
          await this.presentErrorToast(err.error.message);
        }
      );
  }

  /* Recipes */

  async presentRecipeModal(recipeId: string) {
    let component;
    let componentProps;

    if (this.isPrivate) {
      component = RecipeFormComponent;
      componentProps = {
        recipeId,
        insert: false,
      };
    } else {
      component = RcRecipeComponent;
      componentProps = {
        recipeId,
      };
    }

    const modal = await this.modalController.create({
      component,
      componentProps,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data) {
      if (data.userInfo) {
        this.updateUserInfo(data.userInfo);
      }
      if (data.reloadData) {
        this.mediatorService.mediator = 'inventory';
        this.loadRecipes();
      }
    }
  }

  /* Follow/Unfollow */

  onFollowUnfollow() {
    this.userInfoService
      .followUnfollow(this.loggedUserId, this.userId)
      .subscribe((res) => {
        this.storageService.setUserInfo(res);
        this.mediatorService.mediator = 'follow';
        this.loadData();
      });
  }

  /* Slides */

  async segmentChanged() {
    await this.slider.slideTo(this.segment);
  }

  async slideChanged() {
    this.segment = await this.slider.getActiveIndex();
  }

  /* Extras */

  getAvatar(avatar: string) {
    const regEx = /https:\/\/api.adorable.io\/avatars\/300\/\w+@adorable.pngCopy/gi;
    if (regEx.test(avatar)) {
      return avatar;
    }

    return avatar;
  }

  updateUserInfo(userInfo: UserInfo) {
    this.userInfoService
      .updateUserInfo(this.loggedUserInfo.id, userInfo)
      .subscribe((res) => {
        this.storageService.setUserInfo(res);
        this.mediatorService.mediator = 'userInfo';
        this.loadData();
      });
  }

  async presentErrorToast(error: string) {
    const toast = await this.toastController.create({
      message: error || 'Unnable to connect to the server',
      duration: 3000,
    });
    toast.present();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
