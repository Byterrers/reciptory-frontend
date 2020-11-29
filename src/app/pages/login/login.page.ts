import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

// Services.
import { LoginService } from 'src/app/core/services/login.service';
import { UserInfoService } from 'src/app/core/services/user-info.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { MediatorService } from 'src/app/core/services/mediator.service';

// Entities.
import { LoginDto } from 'src/app/core/entities/dtos/login.dto';
import { User } from 'src/app/core/entities/user.class';

// UI Components.
import { ToastController } from '@ionic/angular';

// Utilities.
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit, OnDestroy {
  loginForm: FormGroup;
  errorMessages: any;

  constructor(
    private readonly loginService: LoginService,
    private readonly userInfoService: UserInfoService,
    private readonly storageService: StorageService,
    private readonly mediatorService: MediatorService,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly toastController: ToastController,
  ) {}

  ngOnInit() {
    this.defineValidators();
    this.defineErrorMessages();
  }

  defineValidators() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(60),
          Validators.pattern(
            /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/
          )
        ])
      ),
      password: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(30),
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,30}$/)
        ])
      )
    });
  }

  defineErrorMessages() {
    this.errorMessages = {
      email: [
        { type: 'required', message: 'E-mail is required.' },
        {
          type: 'maxlenght',
          message: 'E-mail length must be lower or equal to 60 characters.'
        }
      ],
      password: [
        { type: 'required', message: 'Password is required.' },
        {
          type: 'minlength',
          message: 'Password length must be longer or equal than 8 characters.'
        },
        {
          type: 'maxlenght',
          message: 'Password length must be lower or equal to 30 characters.'
        },
        {
          type: 'pattern',
          message:
            'Password must contain at least one number, one uppercase and one lowercase characters.'
        }
      ]
    };
  }

  login() {
    this.loginService
      .login({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      } as LoginDto)
      .subscribe(
        (res) => {
          const accessToken = res.access_token;
          const decodedToken = jwt_decode(accessToken);
          const userId = decodedToken.sub;
          const userEmail = decodedToken.email;
          const loggedUser = {
            id: userId,
            email: userEmail
          } as User;
          this.loginService.saveStorage(accessToken, loggedUser);
          this.userInfoService.getUserInfo(userId).subscribe((ret) => {
            this.loginService.saveInfoStorage(ret);
            this.setFilters();
            this.reloadData();
            this.router.navigate(['/app/home']);
          });
        },
        async (err) => {
          await this.presentErrorToast(err.error.message);
          this.router.navigate(['/app/home']);
        }
      );
  }

  setFilters() {
    this.storageService.setByInventory(true);
    this.storageService.setByPreferences(false);
    this.storageService.setByAllergies(false);
  }

  reloadData() {
    this.mediatorService.mediator = 'userInfo';
    this.mediatorService.mediator = 'recipe';
    this.mediatorService.mediator = 'recipesBook';
    this.mediatorService.mediator = 'inventory';
    this.mediatorService.mediator = 'shoppingList';
    this.mediatorService.mediator = 'community';
    this.mediatorService.mediator = 'profile';
  }

  async presentErrorToast(error: string) {
    const toast = await this.toastController.create({
      message: error ? error : 'Unnable to connect to the server',
      duration: 3000
    });
    toast.present();
  }

  ngOnDestroy() {
    this.loginForm.value.email = '';
    this.loginForm.value.password = '';
  }
}
