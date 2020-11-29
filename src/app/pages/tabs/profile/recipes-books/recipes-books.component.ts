import { Component, OnInit, Input, OnChanges } from '@angular/core';

// Services.
import { MediatorService } from 'src/app/core/services/mediator.service';
import { RecipesBookService } from 'src/app/core/services/recipesBook.service';

// Entities.
import { RecipesBook } from 'src/app/core/entities/recipesBook.class';

// Extras.
import { Utils } from 'src/app/common/utils';

// UI Components.
import { RcRecipesBookComponent } from 'src/app/components/rc-components/rc-recipes-book/rc-recipes-book.component';
import { RecipesBookFormComponent } from '../../tabs-components/recipes-book-form/recipes-book-form.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'recipes-books',
  templateUrl: './recipes-books.component.html',
  styleUrls: ['./recipes-books.component.scss'],
})
export class RecipesBooksComponent implements OnInit, OnChanges {
  @Input() userId: string;
  @Input() isPrivate: boolean;
  recipesBooks: RecipesBook[];

  matrix: any;

  dataLoaded = false;
  constructor(
    private readonly recipesBookService: RecipesBookService,
    private readonly mediatorService: MediatorService,
    private readonly modalController: ModalController
  ) {
    this.mediatorService.getMediatorEvent().subscribe((e) => {
      switch (e) {
        case 'recipesBook':
          this.loadData();
          break;
        default:
          break;
      }
    });
  }

  ngOnInit() {
    this.loadData();
  }

  ngOnChanges() {
    this.loadData();
  }

  loadData() {
    this.dataLoaded = false;

    this.recipesBookService
      .getUserRecipesBooksByUserId(this.userId)
      .subscribe((res) => {
        this.recipesBooks = res;
        this.matrix = Utils.arrayToMatrix(this.recipesBooks, 2);
        setTimeout(() => (this.dataLoaded = true));
      });
  }

  /* RecipesBook */

  getImage(image: string) {
    if (image === 'placeholder') {
      return `assets/images/recipe-placeholder.png`;
    }

    return image;
  }

  async recipesBookPresent(recipesBook: RecipesBook, edit: boolean) {
    const component = edit ? RecipesBookFormComponent : RcRecipesBookComponent;
    const componentProps = edit
      ? {
          recipesBook,
          insert: false,
        }
      : {
          recipesBookId: recipesBook.id,
        };
    const modal = await this.modalController.create({
      component,
      componentProps,
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      if (data.reloadData) {
        this.loadData();
      }
    }
  }
}
