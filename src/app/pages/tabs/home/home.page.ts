import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Subscription } from 'rxjs/internal/Subscription';

// Services.
import { MediatorService } from 'src/app/core/services/mediator.service';

// UI Components.
import { InventoryComponent } from './inventory/inventory.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {
  @ViewChild('slides', { static: true }) slider: IonSlides;
  @ViewChild('rcInventory', { static: true }) rcInventory: InventoryComponent;
  @ViewChild('rcShoppingList', { static: true })
  rcShoppingList: ShoppingListComponent;

  segment = 0;

  subscription: Subscription;

  constructor(private readonly mediatorService: MediatorService) {
    this.subscription = this.mediatorService
      .getMediatorEvent()
      .subscribe((e) => {
        switch (e) {
          case 'userInfo':
            if (this.rcInventory) {
              this.rcInventory.loadDynamicData();
            }
            if (this.rcShoppingList) {
              this.rcShoppingList.loadDynamicData();
            }
            break;
          case 'inventory':
            if (this.rcInventory) {
              this.rcInventory.loadDynamicData();
            }
            break;
          default:
            break;
        }
      });
  }

  ngOnInit() {}

  async segmentChanged() {
    await this.slider.slideTo(this.segment);
  }

  async slideChanged() {
    this.segment = await this.slider.getActiveIndex();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
