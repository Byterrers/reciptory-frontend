import { Component, OnInit, Input } from '@angular/core';

// Entities.
import { RecipesBook } from 'src/app/core/entities/recipesBook.class';

// UI Components.
import { RecipesBookFormComponent } from '../../../../pages/tabs/tabs-components/recipes-book-form/recipes-book-form.component';
import { ModalController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-rc-recipesbooks-list',
  templateUrl: './rc-recipesbooks-popover.component.html',
  styleUrls: ['./rc-recipesbooks-popover.component.scss']
})
export class RcRecipesBooksPopoverComponent implements OnInit {
  @Input() recipesBooks: RecipesBook[];

  constructor(
    private readonly popoverController: PopoverController,
    private readonly modalController: ModalController
  ) {}

  ngOnInit() {}

  saveRecipeOnBook(recipesBookId: string) {
    this.popoverController.dismiss({
      recipesBookId
    });
  }

  async presentRecipesBookModal() {
    const modal = await this.modalController.create({
      component: RecipesBookFormComponent,
      componentProps: {
        insert: true
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    this.popoverController.dismiss(data);
  }

  /* Extras */

  onClose() {
    this.popoverController.dismiss();
  }
}
