import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  FormArray,
  Validators,
} from '@angular/forms';
import {
  ToastController,
  ActionSheetController,
  Platform,
  ModalController,
  AlertController,
} from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

import {
  Camera,
  CameraOptions,
  PictureSourceType,
} from '@ionic-native/camera/ngx';

// Services.
import { RecipesService } from 'src/app/core/services/recipes.service';
import { RecipesBookService } from 'src/app/core/services/recipesBook.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { UploadService } from 'src/app/core/services/upload.service';

// Entities.
import { Recipe } from 'src/app/core/entities/recipe.class';
import { RecipeDto } from 'src/app/core/entities/dtos/recipe.dto';
import { Ingredient } from 'src/app/core/entities/ingredient.class';
import { Preference } from 'src/app/core/entities/preference.class';
import { Allergy } from 'src/app/core/entities/allergy.class';
import { Nutrient } from 'src/app/core/entities/nutrient.class';
import { UserInfo } from 'src/app/core/entities/user-info.class';

// UI Components.
import { IonicSelectableComponent } from 'ionic-selectable';

// Extras.
import { Subscription } from 'rxjs/internal/Subscription';
import { Unit } from 'src/app/core/entities/enums/unit.enum';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.scss'],
})
export class RecipeFormComponent implements OnInit {
  @Input() insert?: boolean;
  @Input() recipesBookId: string = null;

  errorMessages: any;
  recipesForm: FormGroup;

  userInfo: UserInfo;
  userId: string;

  recipe: Recipe;
  recipeId: string = null;

  recipeImage: any;
  recipeImageUrl: string;

  ingredients: [];
  preferences: Preference[];
  allergies: Allergy[];
  nutrients: Nutrient[];

  recipePreferences: [];
  recipeAllergies: [];
  recipeNutrients: [];

  ingredientsSubscription: Subscription;

  units: string[];

  dataLoaded = false;

  isMobile: boolean;

  capturedSnapURL: string;
  cameraOptions: CameraOptions = {
    quality: 60,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    // allowEdit: true,
    correctOrientation: true,
    saveToPhotoAlbum: true,
  };

  constructor(
    private readonly recipesService: RecipesService,
    private readonly recipesBookService: RecipesBookService,
    private readonly storageService: StorageService,
    private readonly uploadService: UploadService,
    private readonly domSanitizer: DomSanitizer,
    private readonly platform: Platform,
    private readonly camera: Camera,
    private readonly formBuilder: FormBuilder,
    private readonly modalController: ModalController,
    private readonly actionSheetController: ActionSheetController,
    private readonly alertController: AlertController,
    private readonly toastController: ToastController
  ) {
    this.recipe = new Recipe();
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.platform.is('cordova')
        ? (this.isMobile = true)
        : (this.isMobile = false);
    });
    this.defineValidators();
    this.defineErrorMessages();
    this.loadData();
  }

  loadData() {
    this.userInfo = this.storageService.getUserInfo();
    this.userId = this.userInfo.userId;

    // this.units = Unit.getRecipeUnits();
    this.units = ['u', 'kg', 'l'];

    this.recipesService.getPreferences().subscribe((res) => {
      this.preferences = res;
    });

    this.recipesService.getAllergies().subscribe((res) => {
      this.allergies = res;
    });

    this.recipesService.getNutrients().subscribe((res) => {
      this.nutrients = res;
    });

    if (this.insert) {
      this.loadCreateData();
    } else {
      this.loadUpdateData();
    }
  }

  loadCreateData() {
    this.recipesForm.get('cookingTime').setValue('00:00');
    setTimeout(() => (this.dataLoaded = true));
  }

  loadUpdateData() {
    this.recipesService.getRecipeById(this.recipeId).subscribe((res) => {
      this.recipe = res as Recipe;
      this.loadInputValues();
    });
  }

  loadInputValues() {
    this.recipesForm.get('name').setValue(this.recipe.name);
    this.recipesForm.get('cookingTime').setValue(this.recipe.cookingTime);
    this.recipesForm.get('calories').setValue(this.recipe.calories);
    this.recipe.ingredients.forEach((i) =>
      this.addIngredient(i.quantity, i.unit, i.ingredient)
    );
    this.recipe.steps.forEach((s) => {
      this.addStep(s);
    });
    this.recipesForm.get('nutrients').setValue(this.recipe.nutrients);
    this.recipesForm.get('preferences').setValue(this.recipe.preferences);
    this.recipesForm.get('allergies').setValue(this.recipe.allergies);
    this.recipesForm.get('tags').setValue(this.recipe.tags.toString());
    this.recipesForm.get('shared').setValue(this.recipe.shared);
    this.recipeImageUrl = this.recipe.image;
    setTimeout(() => (this.dataLoaded = true));
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
    this.recipesForm = this.formBuilder.group({
      name: new FormControl('', Validators.compose([Validators.required])),
      cookingTime: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      calories: new FormControl(
        null,
        Validators.compose([Validators.required])
      ),
      recipeIngredients: this.insert
        ? this.formBuilder.array([
            this.formBuilder.group({
              quantity: this.formBuilder.control(
                null,
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
            }),
          ])
        : this.formBuilder.array([]),
      steps: this.insert
        ? this.formBuilder.array([
            this.formBuilder.control(
              '',
              Validators.compose([Validators.required])
            ),
          ])
        : this.formBuilder.array([]),
      preferences: new FormControl(null, Validators.compose([])),
      allergies: new FormControl(null, Validators.compose([])),
      nutrients: new FormControl(null, Validators.compose([])),
      tags: new FormControl(
        '',
        Validators.compose([Validators.pattern(/#\w*/)])
      ),
      shared: new FormControl(true, Validators.compose([Validators.required])),
    });
  }

  get recipeIngredients() {
    return this.recipesForm.get('recipeIngredients') as FormArray;
  }

  addIngredient(quantity?, unit?, ingredient?) {
    this.recipeIngredients.push(
      this.formBuilder.group({
        quantity: this.formBuilder.control(
          quantity ? quantity : null,
          Validators.compose([Validators.required])
        ),
        unit: this.formBuilder.control(
          unit ? unit : '',
          Validators.compose([Validators.required])
        ),
        ingredient: this.formBuilder.control(
          ingredient ? ingredient : '',
          Validators.compose([Validators.required])
        ),
      })
    );
  }

  removeIngredient(i) {
    this.recipeIngredients.removeAt(i);
  }

  get steps() {
    return this.recipesForm.get('steps') as FormArray;
  }

  addStep(s?) {
    this.steps.push(
      this.formBuilder.control(
        s ? s : '',
        Validators.compose([Validators.required])
      )
    );
  }

  removeStep(i) {
    this.steps.removeAt(i);
  }

  defineErrorMessages() {
    this.errorMessages = {
      name: [{ type: 'required', message: 'Name is required.' }],
      cookingTime: [{ type: 'required', message: 'Time is required.' }],
      calories: [
        {
          type: 'required',
          message: 'An approximate value for calories is required.',
        },
      ],
      recipeIngredients: [
        { type: 'required', message: 'Ingredients are required.' },
      ],
      steps: [{ type: 'required', message: 'Steps are required.' }],
      preferences: [],
      allergies: [],
      nutrients: [],
      tags: [
        {
          type: 'pattern',
          message: 'We are looking for something that looks like "#tag"',
        },
      ],
      shared: [
        { type: 'required', message: 'A value for shared is required.' },
      ],
    };
  }

  /* Submit */

  onSubmit() {
    this.insert ? this.createRecipe() : this.updateRecipe();
  }

  createRecipe() {
    const recipe = {
      name: this.recipesForm.value.name,
      cookingTime: this.recipesForm.value.cookingTime.toString(),
      calories: this.recipesForm.value.calories,
      ingredients: this.recipesForm.value.recipeIngredients as any[],
      steps: this.recipesForm.value.steps,
      nutrients: this.recipesForm.value.nutrients || [],
      preferences: this.recipesForm.value.preferences || [],
      allergies: this.recipesForm.value.allergies || [],
      tags: this.recipesForm.value.tags.match(/#\w*/gi) || [],
      author: this.userInfo.username,
      authorId: this.userId,
      rating: 0,
      rates: [],
      comments: [],
      originalId: '',
      isCopy: false,
      image: this.recipeImageUrl || 'placeholder',
      // image: 'placeholder',
      shared: this.recipesForm.value.shared,
    } as RecipeDto;

    this.recipesService.createUserRecipe(this.userId, recipe).subscribe(
      (res) => {
        this.modalController.dismiss({
          reloadData: true,
        });
      },
      async (err) => {
        await this.presentErrorToast(err.error.message);
      }
    );
  }

  updateRecipe() {
    const recipe = {
      id: this.recipeId,
      name: this.recipesForm.value.name,
      cookingTime: this.recipesForm.value.cookingTime.toString(),
      calories: this.recipesForm.value.calories,
      ingredients: this.recipesForm.value.recipeIngredients as any[],
      steps: this.recipesForm.value.steps,
      nutrients: this.recipesForm.value.nutrients || [],
      preferences: this.recipesForm.value.preferences || [],
      allergies: this.recipesForm.value.allergies || [],
      tags: this.recipesForm.value.tags.match(/#\w*/gi) || [],
      author: this.userInfo.username,
      authorId: this.userId,
      rating: this.recipe.rating,
      rates: this.recipe.rates,
      comments: this.recipe.comments,
      originalId: this.recipe.originalId,
      isCopy: this.recipe.isCopy,
      image: this.recipeImageUrl || '',
      shared: this.recipesForm.value.shared,
    } as RecipeDto;
    this.recipesService.updateRecipe(recipe).subscribe(
      (res) => {
        this.modalController.dismiss({
          reloadData: true,
        });
      },
      async (err) => {
        await this.presentErrorToast(err.error.message);
      }
    );
  }

  /* Delete recipe */

  async onDeleteRecipe() {
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
          handler: () => {},
        },
        {
          text: 'Accept',
          handler: () => {
            this.deleteRecipe();
          },
        },
      ],
    });

    await alert.present();
  }

  deleteRecipe() {
    this.recipesService.deleteUserRecipe(this.recipeId, this.userId).subscribe(
      (res) => {
        this.modalController.dismiss({ reloadData: true });
      },
      async (err) => {
        await this.presentErrorToast(err.error.message);
      }
    );
  }

  onTakeRecipeOutFromBook() {
    this.recipesBookService
      .takeRecipeOutFromRecipesBook(this.recipesBookId, this.recipeId)
      .subscribe(
        (res) => {
          this.modalController.dismiss({ reloadData: true });
        },
        async (err) => {
          await this.presentErrorToast(err.error.message);
        }
      );
  }

  /* Recipe functions */

  cookRecipe() {
    this.recipesService.cookRecipe(this.recipeId, this.userId).subscribe(
      (res) => {
        this.modalController.dismiss({
          reloadData: true,
        });
      },
      async (err) => {
        this.presentErrorToast(err.error.message);
      }
    );
  }

  addRecipeIngredientsToShoppingList() {
    this.recipesService
      .addRecipeIngredientsToShoppingList(this.recipeId, this.userId)
      .subscribe(
        (res) => {
          this.modalController.dismiss({
            userInfo: res,
          });
        },
        async (err) => {
          this.presentErrorToast(err.error.message);
        }
      );
  }

  /* Image selection & upload */

  async imageSelector() {
    if (this.isMobile) {
      const actionSheet = await this.actionSheetController.create({
        header: 'A picture is worth a thousand words',
        subHeader: 'Take one or choose it from your gallery!',
        mode: 'ios',
        buttons: [
          {
            text: 'Gallery',
            handler: () => {
              this.cameraOptions.sourceType = PictureSourceType.PHOTOLIBRARY;
              this.takeSnap();
            },
          },
          {
            text: 'Camera',
            handler: () => {
              this.cameraOptions.sourceType = PictureSourceType.CAMERA;
              this.takeSnap();
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ],
      });

      await actionSheet.present();
    }
  }

  takeSnap() {
    this.camera.getPicture(this.cameraOptions).then(
      (imageData) => {
        (window as any).resolveLocalFileSystemURL(
          imageData,
          (fileEntry) => {
            this.recipeImage = fileEntry.file();
          },
          console.error
        );
      },
      async (err) => {
        await this.presentErrorToast(err.error.message);
      }
    );
  }

  onChange(e) {
    if (!this.isMobile) {
      this.recipeImage = e.target.files[0];
    }
  }

  uploadImage() {
    const formData = new FormData();
    if (this.isMobile) {
      formData.append('image', this.recipeImage);
    } else {
      formData.append('image', this.recipeImage);
    }
    this.uploadService.uploadRecipic(formData).subscribe(
      (res) => {
        this.recipeImageUrl = res;
      },
      async (err) => {
        await this.presentErrorToast(err.error.message);
      }
    );
  }

  // Extras.

  compareWith(a, b) {
    return a && b ? a.id === b.id : false;
  }

  getImage(image: string) {
    return this.recipeImageUrl
      ? this.recipeImageUrl === 'placeholder'
        ? 'assets/images/recipe-placeholder.png'
        : image
      : 'assets/images/placeholder-image.png';
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
