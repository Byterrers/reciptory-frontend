import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from '@angular/core';

// Entities.
import { Product } from 'src/app/core/entities/product.class';

// Extras.
import { Utils } from 'src/app/common/utils';

@Component({
  selector: 'rc-card',
  templateUrl: './rc-card.component.html',
  styleUrls: ['./rc-card.component.scss']
})
export class RcCardComponent implements OnInit, OnChanges {
  @Input() title: string;
  @Input() items: Product[];
  @Input() units: [];
  @Input() icon: string;
  @Input() open? = false;
  @Output() reloadData = new EventEmitter<boolean>();

  anyItemAboutToExpire: number;

  constructor() {}

  ngOnInit() {
    this.checkExpirationDate();
  }

  ngOnChanges() {
    this.checkExpirationDate();
  }

  onDisplay() {
    this.open = !this.open;
  }

  doReorder(e) {
    e.detail.complete();
  }

  onReloadData(e) {
    this.reloadData.emit(e);
  }

  checkExpirationDate() {
    this.anyItemAboutToExpire = 1;
    if (this.items.length !== 0) {
      this.items.every((item) => {
        switch (this.anyItemAboutToExpire) {
          case 1:
            this.anyItemAboutToExpire = this.anyItemAboutToExpire = Utils.checkExpirationDate(
              item.expirationDate
            );
            return true;
          case 0:
            if (Utils.checkExpirationDate(item.expirationDate) !== 1) {
              this.anyItemAboutToExpire = this.anyItemAboutToExpire = Utils.checkExpirationDate(
                item.expirationDate
              );
              return true;
            }
          case -1:
            return false;
        }
      });
    }
  }
}
