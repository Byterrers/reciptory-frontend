import { Component, OnInit } from '@angular/core';
import { OCR, OCRSourceType, OCRResult } from '@ionic-native/ocr/ngx';
import {
  Camera,
  CameraOptions,
  PictureSourceType,
} from '@ionic-native/camera/ngx';

// Services.
import { MediatorService } from 'src/app/core/services/mediator.service';
import { ScannerService } from 'src/app/core/services/scanner.service';

// UI Components.
import { ProductFormComponent } from '../product-form/product-form.component';
import { ActionSheetController, ModalController } from '@ionic/angular';

@Component({
  selector: 'rc-scanner-ocr',
  templateUrl: './rc-scanner-ocr.component.html',
  styleUrls: ['./rc-scanner-ocr.component.scss'],
})
export class RcScannerOcrComponent implements OnInit {
  ocrRecognition: any;
  scannedProducts: any[];
  supermarkets = ['Mercadona', 'Consum'];
  supermarket = 'Mercadona';
  snapPath: string;
  dataLoaded = true;

  cameraOptions: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true,
    saveToPhotoAlbum: true,
  };

  constructor(
    private camera: Camera,
    private ocr: OCR,
    private readonly mediatorService: MediatorService,
    private readonly scannerService: ScannerService,
    private readonly modalController: ModalController,
    private readonly actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
    this.snapPath = null;
  }

  /* Picture selection */

  async selectSource() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Scanner options',
      subHeader: 'Choose an option',
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
          icon: 'close',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

  takeSnap() {
    this.camera.getPicture(this.cameraOptions).then((imageData) => {
      this.snapPath = `${imageData}`;
    }, console.error);
  }

  /* Market Selection */

  onIonChange(e) {
    this.supermarket = e.detail.value;
  }

  /* Recognition & parsing */

  recognizeImage() {
    this.dataLoaded = false;
    this.ocr
      .recText(OCRSourceType.NORMFILEURL, this.snapPath)
      .then(async (res: OCRResult) => {
        this.ocrRecognition = res;
        // this.scannerService.scan(this.ocrRecognition.lines.linetext).subscribe(
        //   (ret) => {},
        //   (err) => {}
        // );

        const scannedProducts = this.parseText(
          this.ocrRecognition.lines.linetext
        ).map((p) => {
          return {
            quantity: p.substr(0, p.indexOf(' ')),
            name: p.substr(p.indexOf(' ') + 1, p.length),
          };
        });

        setTimeout(async () => {
          this.dataLoaded = true;
          const modal = await this.modalController.create({
            component: ProductFormComponent,
            componentProps: {
              scannedProducts,
              multiple: true,
            },
          });

          await modal.present();

          const { data } = await modal.onWillDismiss();

          if (data) {
            this.mediatorService.mediator = 'inventory';
          }
        }, 1500);
      });
  }

  async onFakeScan() {
    this.dataLoaded = false;

    const scannedProducts = this.parseText(['']).map((p) => {
      return {
        quantity: p.substr(0, p.indexOf(' ')),
        name: p.substr(p.indexOf(' ') + 1, p.length),
      };
    });

    setTimeout(async () => {
      this.dataLoaded = true;
      const modal = await this.modalController.create({
        component: ProductFormComponent,
        componentProps: {
          scannedProducts,
          multiple: true,
        },
      });

      await modal.present();
    }, 1000);
  }

  parseText(data: string[]) {
    let response = null;
    switch (this.supermarket) {
      case 'Mercadona':
        response = this.mercadonaAlgorithm(data);
        break;
      case 'Consum':
        response = this.consumAlgorithm(data);
        break;
      default:
        break;
    }
    return response;
  }

  mercadonaAlgorithm(data: string[]) {
    // data = [
    //   '20 G, MARIAS',
    //   '32 PIZ,ZA 4 QUESOS',
    //   '534 PIZZA 4 QUESOS',
    //   '3,15',
    //   '3,14',
    //   '6 PIZZA 4 QUESOS',
    //   '3,15',
    //   '3,14'
    // ];

    const productRegexp = /^(\d+\s\w+)[\s\w|.|,]*$/;
    const response = data.filter((l) => l.match(productRegexp));

    return response;
  }

  consumAlgorithm(data: string[]) {
    // data = [
    //   'PIZZA 4 QUESOS',
    //   '303 x',
    //   'PIZZA 4 QUESOS',
    //   'PIZZA 4 QUESOS',
    //   '3,15',
    //   '3,14',
    //   'PIZZA 4 QUESOS',
    //   '23 x',
    //   '3,15',
    //   '3,14'
    // ];

    const productRegexp = /^(\w+)[\s\w]*$/;
    const quantityRegexp = /^(\d+\sx)$/;

    const response = data
      .map((l, i, a) => {
        if (i < a.length) {
          if (l.match(quantityRegexp)) {
            return `${l.substr(0, l.indexOf('x'))} ${a[i - 1]}`;
          }
          if (l.match(productRegexp) && !a[i + 1].match(quantityRegexp)) {
            return `1 ${l}`;
          }
        } else {
          if (l.match(productRegexp)) {
            return `1 ${l}`;
          }
        }
      })
      .filter((l) => l);

    return response;
  }

  /* Extras */

  onClose() {
    this.modalController.dismiss();
  }
}
