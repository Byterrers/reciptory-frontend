import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  FormArray,
  Validators,
} from '@angular/forms';

import {
  ToastController,
  ActionSheetController,
  Platform,
  ModalController,
  AlertController,
  IonInput,
} from '@ionic/angular';

import {
  Camera,
  CameraOptions,
  PictureSourceType,
} from '@ionic-native/camera/ngx';

// Services.
import { UserInfoService } from 'src/app/core/services/user-info.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { UploadService } from 'src/app/core/services/upload.service';

// Entities.
import { UserInfo } from 'src/app/core/entities/user-info.class';
import { UserInfoDto } from 'src/app/core/entities/dtos/user-info.dto';

@Component({
  selector: 'edit-profile',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
})
export class ProfileFormComponent implements OnInit {
  userInfo: UserInfo;

  editForm: FormGroup;
  errorMessages: any;

  capturedSnapURL: string;
  cameraOptions: CameraOptions = {
    quality: 60,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true,
    saveToPhotoAlbum: true,
  };

  profileImage: any;
  profileImageUrl: string;

  isMobile: boolean;

  constructor(
    private readonly userInfoService: UserInfoService,
    private readonly storageService: StorageService,
    private readonly uploadService: UploadService,
    private readonly formBuilder: FormBuilder,
    private readonly modalController: ModalController,
    private readonly actionSheetController: ActionSheetController,
    private readonly toastController: ToastController,
    private platform: Platform,
    private camera: Camera
  ) {}

  ngOnInit() {
    this.platform.ready().then(() => {
      this.platform.is('cordova')
        ? (this.isMobile = true)
        : (this.isMobile = false);
    });
    this.defineValidators();
    this.defineErrorMessages();
    this.loadData();
  }

  loadData() {
    this.userInfo = this.storageService.getUserInfo();
    this.profileImage = this.userInfo.avatar;

    this.loadInputValues();
  }

  /* Reactive form */

  loadInputValues() {
    this.editForm.get('name').setValue(this.userInfo.name);
    this.editForm.get('username').setValue(this.userInfo.username);
    this.editForm.get('country').setValue(this.userInfo.country);
    this.editForm.get('city').setValue(this.userInfo.city);
    this.editForm.get('gender').setValue(this.userInfo.gender);
  }

  defineValidators() {
    this.editForm = this.formBuilder.group({
      name: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(60),
        ])
      ),
      username: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(60),
        ])
      ),
      country: new FormControl(
        '',
        Validators.compose([Validators.minLength(1), Validators.maxLength(60)])
      ),
      city: new FormControl(
        '',
        Validators.compose([Validators.minLength(1), Validators.maxLength(60)])
      ),
      gender: new FormControl(
        '',
        Validators.compose([Validators.minLength(1), Validators.maxLength(30)])
      ),
    });
  }

  defineErrorMessages() {
    this.errorMessages = {
      name: [{ type: 'required', message: 'Name is required.' }],
      username: [
        {
          type: 'required',
          message: 'Username is required.',
        },
        {
          type: 'minlength',
          message: 'Username length must be longer or equal than 1 characters.',
        },
        {
          type: 'maxlength',
          message: 'Username length must be lower or equal than 60 characters.',
        },
      ],
      coutry: [
        {
          type: 'minlength',
          message: 'Country must be longer or equal than 1 characters.',
        },
        {
          type: 'minlength',
          message: 'Country must be lower or equal than 60 characters.',
        },
      ],
      city: [
        {
          type: 'minlength',
          message: 'City length must be longer or equal than 1 characters.',
        },
        {
          type: 'maxlength',
          message: 'City length must be lower or equal than 60 characters.',
        },
      ],
      gender: [
        {
          type: 'minlength',
          message: 'Gender length must be longer or equal than 1 characters.',
        },
        {
          type: 'maxlength',
          message: 'Gender length must be lower or equal than 30 characters.',
        },
      ],
    };
  }

  // Camara
  async imageSelector() {
    if (this.isMobile) {
      const actionSheet = await this.actionSheetController.create({
        header: 'A picture is worth a thousand words',
        subHeader: 'Take one or choose it from your gallery!',
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
            role: 'cancel',
          },
        ],
      });

      await actionSheet.present();
    }
  }

  takeSnap() {
    this.camera.getPicture(this.cameraOptions).then(
      (imageData) => {
        (window as any).resolveLocalFileSystemURL(
          imageData,
          (fileEntry) => {
            this.profileImage = fileEntry.file();
          },
          console.error
        );
      },
      async (err) => {
        await this.presentErrorToast(err.error.message);
      }
    );
  }

  onChange(e) {
    if (!this.isMobile) {
      this.profileImage = e.target.files[0];
    }
  }

  uploadImage() {
    const formData = new FormData();
    if (this.isMobile) {
      formData.append('image', this.profileImage);
    } else {
      formData.append('image', this.profileImage);
    }
    this.uploadService.uploadAvatar(formData).subscribe(
      (res) => {
        this.profileImageUrl = res;
      },
      async (err) => {
        await this.presentErrorToast(err.error.message);
      }
    );
  }

  /* UserInfo */

  onSubmit() {
    const userInfo = {
      username: this.editForm.value.username,
      name: this.editForm.value.name,
      gender: this.editForm.value.gender,
      country: this.editForm.value.country,
      city: this.editForm.value.city,
      avatar: this.profileImage || '',
      preferences: null,
      allergies: null,
      userShoppingLists: null,
      following: null,
      followers: null,
    } as UserInfoDto;
    this.userInfoService
      .updateUserInfo(this.userInfo.id, userInfo)
      .subscribe((res) => {
        this.storageService.setUserInfo(res);
        this.modalController.dismiss({
          reloadData: true,
        });
      });
  }

  /* Extras */

  getAvatar(avatar: string) {
    const regEx = /https:\/\/api.adorable.io\/avatars\/300\/\w+@adorable.pngCopy/gi;
    if (regEx.test(avatar)) {
      return avatar;
    }

    return avatar;
  }

  async presentErrorToast(error: string) {
    const toast = await this.toastController.create({
      message: error || 'Unnable to connect to the server',
      duration: 3000,
    });
    toast.present();
  }

  onClose() {
    this.modalController.dismiss();
  }
}
