import { Component, OnInit } from '@angular/core';

// UI Components
import { ModalController, PopoverController } from '@ionic/angular';

// Services
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-search-popover',
  templateUrl: './search-popover.component.html',
  styleUrls: ['./search-popover.component.scss']
})
export class SearchPopoverComponent implements OnInit {
  constructor(
    private readonly popoverController: PopoverController,
    private readonly modalController: ModalController,
    private readonly storageService: StorageService
  ) {}

  byInventory: boolean;
  byPreferences: boolean;
  byAllergies: boolean;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.byInventory = this.storageService.getByInventory();
    this.byPreferences = this.storageService.getByPreferences();
    this.byAllergies = this.storageService.getByAllergies();
  }

  // Extras.

  onClose() {
    this.popoverController.dismiss();
  }

  onAccept() {
    this.storageService.setByInventory(this.byInventory);
    this.storageService.setByPreferences(this.byPreferences);
    this.storageService.setByAllergies(this.byAllergies);

    this.popoverController.dismiss({ reloadData: true });
  }

  changeByInventory(event) {
    this.byInventory = event.detail.checked;
  }

  changeByPreferences(event) {
    this.byPreferences = event.detail.checked;
  }

  changeByAllergies(event) {
    this.byAllergies = event.detail.checked;
  }
}
