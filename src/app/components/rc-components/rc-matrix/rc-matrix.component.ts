import {
  Component,
  OnInit,
  OnChanges,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

// Extras.
import { Utils } from 'src/app/common/utils';

@Component({
  selector: 'rc-matrix',
  templateUrl: './rc-matrix.component.html',
  styleUrls: ['./rc-matrix.component.scss'],
})
export class RcMatrixComponent implements OnInit, OnChanges, OnDestroy {
  @Input() items: any[];
  @Input() cols: number;
  @Output() onItemClick: EventEmitter<string> = new EventEmitter<string>();

  matrix: any;

  dataLoaded: boolean;

  constructor() {}

  ngOnInit() {
    this.dataLoaded = false;
    this.matrix = Utils.arrayToMatrix(this.items, this.cols);
    setTimeout(() => (this.dataLoaded = true));
  }

  ngOnChanges() {
    this.dataLoaded = false;
    this.matrix = Utils.arrayToMatrix(this.items, this.cols);
    setTimeout(() => (this.dataLoaded = true));
  }

  onImageClick(e) {
    this.onItemClick.emit(e);
  }

  getImage(image: string) {
    if (image === 'placeholder') {
      return `assets/images/recipe-placeholder.png`;
    }

    return image;
  }

  ngOnDestroy() {
    this.items = null;
    this.cols = null;
  }
}
