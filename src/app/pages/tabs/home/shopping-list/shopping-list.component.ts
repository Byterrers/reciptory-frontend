import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageService } from 'src/app/core/services/storage.service';

// Services.
import { UserInfoService } from 'src/app/core/services/user-info.service';

// UI Components.
import { IonInput } from '@ionic/angular';
import { UserInfo } from 'src/app/core/entities/user-info.class';

@Component({
  selector: 'rc-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
  @ViewChild('newItemInput', { static: false }) newItemInput?: IonInput;

  userInfo: UserInfo;
  shoppingList: string[];

  enableSaving: boolean;

  constructor(
    private readonly userInfoService: UserInfoService,
    private readonly storageService: StorageService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadStaticData();
    this.loadDynamicData();
  }

  loadStaticData() {
    this.enableSaving = false;
  }

  loadDynamicData() {
    this.userInfo = this.storageService.getUserInfo();
    this.shoppingList = Object.assign([], this.userInfo.userShoppingLists);
  }

  onAddItem(e) {
    this.userInfo.userShoppingLists.push(this.newItemInput.value);
    this.shoppingList.push(this.newItemInput.value);
    this.newItemInput.value = '';
    this.enableSaving = true;
  }

  onRemoveItem(e, index) {
    this.userInfo.userShoppingLists.splice(index, 1);
    this.shoppingList.splice(index, 1);
    this.enableSaving = true;
  }

  onShoppingListSave() {
    const userShoppingLists = this.shoppingList.filter(
      (i) => i !== '' && i !== undefined
    );
    const updatedLoggedUserInfo = {
      id: this.userInfo.id,
      userId: this.userInfo.id,
      username: null,
      name: null,
      gender: null,
      country: null,
      city: null,
      avatar: null,
      preferences: null,
      allergies: null,
      userShoppingLists,
      following: null,
      followers: null
    } as UserInfo;
    this.userInfoService
      .updateUserInfo(this.userInfo.id, updatedLoggedUserInfo)
      .subscribe((res) => {
        this.storageService.setUserInfo(res);
        this.loadData();
      });
  }

  // Ionic events.

  async onIonInput(e, i) {
    this.shoppingList[i] = e.target.value;
    e.target.value ? (this.enableSaving = true) : (this.enableSaving = false);
  }

  // UI.

  isSavingDisabled() {
    return (
      !this.enableSaving ||
      this.shoppingList.includes(undefined) || this.shoppingList.includes('')
    );
  }

  isAddingDisabled() {
    return this.newItemInput && this.newItemInput.value === '';
  }
}
