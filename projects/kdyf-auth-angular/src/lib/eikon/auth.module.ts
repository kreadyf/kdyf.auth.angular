import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {reducer} from './auth.reducer';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {AuthEffects} from './auth.effects';
import {AuthGuard} from './services/auth-guard.service';
import {AuthConfig} from './models/auth-config.model';
import {AuthConfigService} from './services/auth-config.service';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthService} from './services/auth.service';
import {metaReducers} from './auth.meta-reducer';
import {AuthHttpInterceptor} from './services/auth-http-interceptor.service';

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
        AuthGuard,
        AuthService,
        AuthConfigService,
        {
          provide: 'authConfig', useValue: config
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthHttpInterceptor,
          multi: true
        }
      ]
    };
  }
}

@NgModule({
  imports: [
    AuthModule,
    StoreModule.forFeature('auth', reducer, {metaReducers}),
    EffectsModule.forFeature([AuthEffects]),
  ],
})

export class RootAuthModule {
}
