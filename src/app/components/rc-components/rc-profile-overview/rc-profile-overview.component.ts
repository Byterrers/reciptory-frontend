import { Component, OnInit, Input } from '@angular/core';

//
import { UserInfo } from 'src/app/core/entities/user-info.class';

@Component({
  selector: 'rc-profile-overview',
  templateUrl: './rc-profile-overview.component.html',
  styleUrls: ['./rc-profile-overview.component.scss'],
})
export class RcProfileOverviewComponent implements OnInit {
  @Input() userInfo: UserInfo;

  constructor() {}

  ngOnInit() {}

  // Extras.

  getAvatar(avatar: string) {
    const regEx = /https:\/\/api.adorable.io\/avatars\/300\/\w+@adorable.pngCopy/gi;
    if (regEx.test(avatar)) {
      return avatar;
    }

    return avatar;
  }
}
