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

import {reducer} from './auth.reducer';
import {metaReducers} from './auth.meta-reducer';
// Services
import {EikonService} from './eikon/eikon.service';
import {JwsSimpleService} from './jws-simple/jws-simple.service';
import {AuthAzureAdService} from './azure-ad/auth-azure-ad.service';
// Others
import {AuthInterceptor} from './auth.interceptor';
import {AuthGuard} from './shared/services/auth.guard';
import {Configuration} from './shared/models/configuration.model';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [],
  exports: []
})

export class AuthModule {
  static forRoot(config: Configuration[]): ModuleWithProviders {
    return {
      ngModule: RootAuthModule,
      providers: [
        AuthGuard,

        AuthAzureAdService,
        EikonService,
        JwsSimpleService,

        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        },
        {
          provide: 'authConfig', useValue: config
        }
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
