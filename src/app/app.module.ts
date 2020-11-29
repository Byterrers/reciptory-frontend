import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routes';

// Interceptors.
import {
  AuthInterceptor
} from './core/interceptors/auth.interceptor';

// Componentes nativos.
import { Camera } from '@ionic-native/camera/ngx';
import { OCR } from '@ionic-native/ocr/ngx';

// Módulos de componentes.
import { IonicSelectableModule } from 'ionic-selectable';

// Módulos de componentes propios.
import { RcComponentsModule } from './components/rc-components/rc-components.module';
import { TabsComponentsModule } from './pages/tabs/tabs-components/tabs-components.module';

// Módulos de páginas.

import { TabsPageModule } from './pages/tabs/tabs.module';

// Módulos de utilidad.
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutes,
    HttpClientModule,
    IonicSelectableModule,
    RcComponentsModule,
    TabsComponentsModule,
    TabsPageModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    OCR,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
