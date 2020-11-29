import { Component, OnInit, Input, OnChanges } from '@angular/core';

// Services.
import { RecipesBookService } from 'src/app/core/services/recipesBook.service';
import { UserInfoService } from 'src/app/core/services/user-info.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { MediatorService } from 'src/app/core/services/mediator.service';

// Entities.
import { RecipesBook } from 'src/app/core/entities/recipesBook.class';

// UI Components.
import { ModalController } from '@ionic/angular';
import { RecipeFormComponent } from 'src/app/pages/tabs/tabs-components/recipe-form/recipe-form.component';
import { UserInfo } from 'src/app/core/entities/user-info.class';

@Component({
  selector: 'rc-recipes-book',
  templateUrl: './rc-recipes-book.component.html',
  styleUrls: ['./rc-recipes-book.component.scss']
})
export class RcRecipesBookComponent implements OnInit {
  @Input() recipesBookId: string;

  recipesBook: RecipesBook;

  dataLoaded = false;

  loggedUserInfo: UserInfo;

  constructor(
    private readonly recipesBookService: RecipesBookService,
    private readonly userInfoService: UserInfoService,
    private readonly storageService: StorageService,
    private readonly mediatorService: MediatorService,
    private readonly modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loggedUserInfo = this.storageService.getUserInfo();
    this.loadRecipesBook();
  }

  loadRecipesBook() {
    this.dataLoaded = false;
    this.recipesBookService
      .getRecipesBookById(this.recipesBookId)
      .subscribe((res) => {
        this.recipesBook = res as RecipesBook;
        setTimeout(() => (this.dataLoaded = true));
      });
  }

  async onPresentRecipeModal(recipeId: string) {
    const modal = await this.modalController.create({
      component: RecipeFormComponent,
      componentProps: {
        recipeId,
        insert: false,
        recipesBookId: this.recipesBookId
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      if (data.userInfo) {
        this.updateUserInfo(data.userInfo);
      }
      if (data.reloadData) {
        this.mediatorService.mediator = 'recipesBook';
        this.mediatorService.mediator = 'inventory';
        this.loadRecipesBook();
      }
    }
  }

  /* Extras */

  updateUserInfo(userInfo: UserInfo) {
    this.userInfoService
      .updateUserInfo(this.loggedUserInfo.id, userInfo)
      .subscribe((res) => {
        this.storageService.setUserInfo(res);
        this.mediatorService.mediator = 'userInfo';
        this.loadData();
      });
  }

  onClose() {
    this.modalController.dismiss();
  }
}
