// Angular
import {CommonModule} from '@angular/common';
import {NgModule, ModuleWithProviders} from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
// NGRX
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';

import {EikonEffects} from './eikon/eikon.effects';
import {AzureAdEffects} from './azure-ad/azure-ad.effects';
import {JwsSimpleEffects} from './jws-simple/jws-simple.effects';

import {reducer} from './jws-simple/jws-simple.reducer';
import {metaReducers} from './jws-simple/jws-simple.meta-reducer';
// Services
import {EikonService} from './eikon/services/eikon.service';
import {JwsSimpleService} from './jws-simple/services/jws-simple.service';
import {AuthAzureAdService} from './azure-ad/services/auth-azure-ad.service';
// Interceptors
import {EikonAuthInterceptor} from './eikon/services/eikon-auth.interceptor';
import {AzureAdAuthInterceptor} from './azure-ad/services/azure-ad-auth.interceptor';
import {JwsSimpleAuthInterceptor} from './jws-simple/services/jws-simple-auth.interceptor';
// Guards
import {EikonGuard} from './eikon/services/eikon.guard';
import {JwsSimpleGuard} from './jws-simple/services/jws-simple.guard';
import {AuthAzureAdGuard} from './azure-ad/services/auth-azure-ad.guard';
// Others
import {AuthConfig} from './models/auth-config.model';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [],
  exports: []
})

export class AuthModule {
  static forRoot(config: AuthConfig): ModuleWithProviders {
    return {
      ngModule: RootAuthModule,
      providers: [
        AuthAzureAdGuard,
        EikonGuard,
        JwsSimpleGuard,

        AuthAzureAdService,
        EikonService,
        JwsSimpleService,

        {
          provide: HTTP_INTERCEPTORS,
          useClass: AzureAdAuthInterceptor,
          multi: true
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: EikonAuthInterceptor,
          multi: true
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: JwsSimpleAuthInterceptor,
          multi: true
        },

        {
          provide: 'authConfig', useValue: config
        },
      ]
    };
  }
}

@NgModule({
  imports: [
    AuthModule,
    StoreModule.forFeature('auth', reducer, {metaReducers}),
    EffectsModule.forFeature([AzureAdEffects, EikonEffects, JwsSimpleEffects]),
  ],
})

export class RootAuthModule {
}
