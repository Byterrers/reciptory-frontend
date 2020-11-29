import { Component, OnInit, ViewChild } from '@angular/core';

// Services.
import { TimelineService } from 'src/app/core/services/timeline.service';
import { UserInfoService } from 'src/app/core/services/user-info.service';
import { MediatorService } from 'src/app/core/services/mediator.service';
import { StorageService } from 'src/app/core/services/storage.service';

// UI Components.
import { RcRecipeComponent } from 'src/app/components/rc-components/rc-recipe/rc-recipe.component';
import { ModalController, IonRefresher } from '@ionic/angular';

@Component({
  selector: 'community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit {
  @ViewChild('refresher', { static: true }) refresher: IonRefresher;

  timeline: any[];

  userId: string;

  dataLoaded = false;

  recipesLoaded = false;

  constructor(
    private readonly timelineService: TimelineService,
    private readonly userInfoService: UserInfoService,
    private readonly mediatorService: MediatorService,
    private readonly modalController: ModalController,
    private readonly storageService: StorageService
  ) {
    this.mediatorService.getMediatorEvent().subscribe((e) => {
      switch (e) {
        case 'community':
          this.loadData();
          break;
        default:
          break;
      }
    });
  }

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    this.userId = this.storageService.getUserInfo().userId;
    this.dataLoaded = false;
    const timeline = await this.timelineService.getUsersTimeline(this.userId);

    for await (const e of timeline) {
      const user = await this.userInfoService.getUserInfoPromise(e.userId);
      e.avatar = user.avatar;
    }

    this.timeline = timeline;

    setTimeout(() => (this.dataLoaded = true));
  }

  async presentRecipeModal(recipeId: string) {
    const modal = await this.modalController.create({
      component: RcRecipeComponent,
      componentProps: {
        recipeId,
      },
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data) {
      if (data.reloadData) {
        this.mediatorService.mediator = 'inventory';
      }
    }
  }

  // Extras.

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

  async refresh() {
    this.dataLoaded = false;
    const timeline = await this.timelineService.getUsersTimeline(this.userId);

    for await (const e of timeline) {
      const user = await this.userInfoService.getUserInfoPromise(e.userId);
      e.avatar = user.avatar;
    }

    this.timeline = timeline;

    setTimeout(() => (this.dataLoaded = true));
    this.refresher.complete();
  }
}
