import { Component, OnInit, Input } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray
} from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';

// Services.
import { RecipesBookService } from 'src/app/core/services/recipesBook.service';
import { StorageService } from 'src/app/core/services/storage.service';

// Entities.
import { RecipesBook } from 'src/app/core/entities/recipesBook.class';
import { UserInfo } from 'src/app/core/entities/user-info.class';

// UI Components.
import { ModalController, ToastController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { RecipesService } from 'src/app/core/services/recipes.service';
import { Recipe } from 'src/app/core/entities/recipe.class';

@Component({
  selector: 'app-recipes-book',
  templateUrl: './recipes-book-form.component.html',
  styleUrls: ['./recipes-book-form.component.scss']
})
export class RecipesBookFormComponent implements OnInit {
  @Input() recipesBook: RecipesBook;
  @Input() insert: boolean;

  errorMessages: any;
  recipesBookForm: FormGroup;

  userInfo: UserInfo;
  userId: string;

  recipes: Recipe[];

  recipesSubscription: Subscription;

  dataLoaded = false;

  constructor(
    private readonly recipesBookService: RecipesBookService,
    private readonly recipesService: RecipesService,
    private readonly storageService: StorageService,
    private readonly formBuilder: FormBuilder,
    private readonly modalController: ModalController,
    private readonly toastController: ToastController
  ) {
    this.recipesBook = !this.recipesBook
      ? new RecipesBook()
      : Object.assign({}, this.recipesBook);
  }

  ngOnInit() {
    this.defineValidators();
    this.defineErrorMessages();
    this.loadData();
  }

  loadData() {
    this.userInfo = this.storageService.getUserInfo();
    this.userId = this.userInfo.userId;

    this.recipesService.getSharedRecipes().subscribe((res) => {
      this.recipes = res;
    });

    if (this.insert) {
      this.loadCreateData();
    } else {
      this.loadUpdateData();
    }
  }

  loadCreateData() {
    setTimeout(() => (this.dataLoaded = true));
  }

  loadUpdateData() {
    this.loadInputValues();
  }

  loadInputValues() {
    this.recipesBookForm.get('name').setValue(this.recipesBook.name);
    // this.recipesBook.recipes.forEach((i) => this.addRecipesBookRecipes(i));
    setTimeout(() => (this.dataLoaded = true));
  }

  onSearchRecipes(event: {
    component: IonicSelectableComponent;
    text: string;
  }) {
    const text = event.text.trim().toLowerCase();
    event.component.startSearch();

    if (this.recipesSubscription) {
      this.recipesSubscription.unsubscribe();
    }

    if (!text) {
      if (this.recipesSubscription) {
        this.recipesSubscription.unsubscribe();
      }
      event.component.items = [];
      event.component.endSearch();
      return;
    }

    this.recipesSubscription = this.recipesService
      .searchRecipeByName(text, false, false, false, '')
      .subscribe((res) => {
        if (this.recipesSubscription.closed) {
          return;
        }
        event.component.items = this.filterRecipes(res, text);
        event.component.endSearch();
      });
  }

  filterRecipes(recipes: Recipe[], text: string) {
    return recipes.filter((recipe) => {
      return (
        recipe.name.toLowerCase().indexOf(text) !== -1 ||
        recipe.name.toLowerCase().indexOf(text) !== -1
      );
    });
  }

  get recipesBookRecipes() {
    return this.recipesBookForm.get('recipesBookRecipes') as FormArray;
  }

  addRecipesBookRecipes(recipe?) {
    this.recipesBookRecipes.push(
      new FormControl(
        recipe ? recipe : null,
        Validators.compose([Validators.required])
      )
    );
  }

  removeRecipesBookRecipe(i) {
    this.recipesBookRecipes.removeAt(i);
  }

  /* Reactive form */

  defineValidators() {
    this.recipesBookForm = this.formBuilder.group({
      name: new FormControl('', Validators.compose([Validators.required]))
      // recipesBookRecipes: this.insert
      //   ? this.formBuilder.array([
      //       new FormControl(null, Validators.compose([Validators.required]))
      //     ])
      //   : this.formBuilder.array([])
    });
  }

  defineErrorMessages() {
    this.errorMessages = {
      name: [{ type: 'required', message: 'Name is required.' }]
    };
  }

  onSubmit() {
    this.insert ? this.createRecipesBook() : this.updateRecipesBook();
  }

  createRecipesBook() {
    const recipesBook = {
      name: this.recipesBookForm.value.name,
      recipes: [],
      // recipes: this.recipesBookForm.value.recipesBookRecipes.map((r) => r.id),
      userId: this.userId,
      favorite: false
    } as RecipesBook;

    this.recipesBookService.insertUsersRecipesBook(recipesBook).subscribe(
      (res) => {
        this.modalController.dismiss({
          reloadData: true
        });
      },
      async (err) => {
        await this.presentErrorToast(err.error.message);
      }
    );
  }

  updateRecipesBook() {
    const recipesBook = {
      name: this.recipesBookForm.value.name,
      recipes: [],
      // recipes: this.recipesBookForm.value.recipesBookRecipes.map((r) => r.id),
      userId: this.userId,
      favorite: this.recipesBook.favorite
    } as RecipesBook;
    this.recipesBookService
      .updateUsersRecipesBook(this.recipesBook.id, recipesBook)
      .subscribe(
        (res) => {
          this.modalController.dismiss({
            reloadData: true
          });
        },
        async (err) => {
          await this.presentErrorToast(err.error.message);
        }
      );
  }

  onDeleteRecipesBook(recipesBookId: string) {
    this.recipesBookService
      .deleteUsersRecipesBook(recipesBookId)
      .subscribe((res) => {
        this.modalController.dismiss({
          reloadData: true
        });
      });
  }

  /* Extras */

  async presentErrorToast(error: string) {
    const toast = await this.toastController.create({
      message: error || 'Unnable to connect to the server',
      duration: 3000
    });
    toast.present();
  }

  onClose() {
    this.modalController.dismiss();
  }
}
