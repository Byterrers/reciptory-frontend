import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {
  IonSlides,
  ToastController,
  PopoverController,
  ModalController,
  IonTextarea,
} from '@ionic/angular';

// Services
import { MediatorService } from 'src/app/core/services/mediator.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { UserInfoService } from 'src/app/core/services/user-info.service';
import { RecipesService } from 'src/app/core/services/recipes.service';
import { RecipesBookService } from 'src/app/core/services/recipesBook.service';

// Entities.
import { UserInfo } from 'src/app/core/entities/user-info.class';
import { Recipe } from 'src/app/core/entities/recipe.class';
import { RecipesBook } from 'src/app/core/entities/recipesBook.class';

// UI Components.
import { RcRecipesBooksPopoverComponent } from './rc-recipesbooks-popover/rc-recipesbooks-popover.component';

@Component({
  selector: 'rc-recipe',
  templateUrl: './rc-recipe.component.html',
  styleUrls: ['./rc-recipe.component.scss'],
})
export class RcRecipeComponent implements OnInit {
  @ViewChild('slides', { static: true }) slider: IonSlides;
  @ViewChild('commentTextarea', { static: true }) commentTextarea: IonTextarea;
  @Input() recipeId: string;

  recipe: Recipe;

  userInfo: UserInfo;
  userId: string;

  commentText: string;

  userRecipesBooks: RecipesBook[];

  dataLoaded = false;

  segment = 0;

  constructor(
    private readonly recipesService: RecipesService,
    private readonly recipesBookService: RecipesBookService,
    private readonly userInfoService: UserInfoService,
    private readonly mediatorService: MediatorService,
    private readonly storageService: StorageService,
    private readonly modalController: ModalController,
    private readonly toastController: ToastController,
    private readonly popoverController: PopoverController
  ) {}

  ngOnInit() {
    this.loadStaticData();
    this.loadDynamicData();
  }

  loadStaticData() {
    this.userInfo = this.storageService.getUserInfo();
    this.userId = this.userInfo.userId;
  }

  loadDynamicData() {
    this.loadRecipe();
    this.loadRecipesBooks();
  }

  loadRecipe() {
    this.recipesService.getRecipeById(this.recipeId).subscribe((res) => {
      this.recipe = res as Recipe;
      if (this.recipe.comments.length > 0) {
        const comments = this.recipe.comments;
        this.recipe.comments = [];
        comments.forEach((c: any) => {
          this.userInfoService.getUserInfo(c.userId).subscribe((u: any) => {
            this.recipe.comments.push({
              userId: c.userId,
              username: u.username,
              avatar: u.avatar,
              content: c.content,
              timestamp: new Date(),
            });
          });
        });
        setTimeout(() => (this.dataLoaded = true));
      } else {
        setTimeout(() => (this.dataLoaded = true));
      }
    });
  }

  loadRecipesBooks() {
    this.recipesBookService
      .getUserNonFavoriteRecipesBooksByUserId(this.userId)
      .subscribe(
        (res) => {
          this.userRecipesBooks = res;
        },
        async (err) => {
          await this.presentErrorToast(err.error.message);
        }
      );
  }

  async presentRecipeModal() {
    const modal = await this.modalController.create({
      component: RcRecipeComponent,
      componentProps: {
        recipeId: this.recipe.originalId,
      },
    });

    await modal.present();
  }

  async presentRecipesBooksPopover() {
    const popover = await this.popoverController.create({
      component: RcRecipesBooksPopoverComponent,
      componentProps: {
        recipesBooks: this.userRecipesBooks,
      },
    });

    await popover.present();

    const { data } = await popover.onDidDismiss();

    if (data) {
      if (data.recipesBookId) {
        const recipeUserInfo = {
          userId: this.userId,
          author: this.userInfo.username,
        };
        this.saveRecipeOnBook(recipeUserInfo, data.recipesBookId);
      }

      if (data.reloadData) {
        this.mediatorService.mediator = 'recipesBook';
        this.loadRecipesBooks();
      }
    }
  }

  saveRecipeOnBook(recipeUserInfo, recipesBookId) {
    this.recipesService
      .saveRecipe(this.recipe.id, recipesBookId, recipeUserInfo)
      .subscribe(
        (res) => {
          this.mediatorService.mediator = 'recipesBook';
          this.loadDynamicData();
        },
        async (err) => {
          await this.presentErrorToast(err.error.message);
        }
      );
  }

  shareRecipe() {
    this.recipe.shared = !this.recipe.shared;
    const shared = {
      shared: this.recipe.shared,
    };
    this.recipesService.shareRecipe(this.recipe.id, shared).subscribe(
      (res) => {
        this.mediatorService.mediator = 'recipe';
        this.loadRecipe();
      },
      async (err) => {
        await this.presentErrorToast(err.error.message);
      }
    );
  }

  rateRecipe(e) {
    const rate = {
      userId: this.userId,
      rating: e.detail.value,
    };
    this.recipesService.rateRecipe(this.recipe.id, rate).subscribe(
      (res) => {
        // this.mediatorService.mediator = 'recipe';
        this.loadRecipe();
      },
      async (err) => {
        await this.presentErrorToast(err.error.message);
      }
    );
  }

  sendComment() {
    const comment = {
      userId: this.userId,
      content: this.commentText,
      timestamp: new Date(),
    };
    this.recipesService.commentRecipe(this.recipe.id, comment).subscribe(
      (res) => {
        // this.mediatorService.mediator = 'recipe';
        this.commentText = '';
        this.loadDynamicData();
      },
      async (err) => {
        await this.presentErrorToast(err.error.message);
      }
    );
  }

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

  getImage(image: string) {
    if (image === 'placeholder') {
      return `assets/images/recipe-placeholder.png`;
    }

    return image;
  }

  async presentErrorToast(error: string) {
    const toast = await this.toastController.create({
      message: error || 'Unnable to connect to the server',
      duration: 3000,
    });
    toast.present();
  }

  onClose() {
    this.modalController.dismiss();
  }
}
