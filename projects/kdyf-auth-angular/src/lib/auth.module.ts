// Angular
import {CommonModule} from '@angular/common';
import {NgModule, ModuleWithProviders} from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
// NGRX
import {reducer} from './auth.reducer';
import {StoreModule} from '@ngrx/store';
import {AuthEffects} from './auth.effects';
import {EffectsModule} from '@ngrx/effects';
import {metaReducers} from './auth.meta-reducer';
// Services
import {AuthService} from './services/auth.service';
import {AuthGuard} from './services/auth-guard.service';
import {AuthHttpInterceptor} from './services/auth-http-interceptor.service';
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
        AuthGuard,
        AuthService,
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
