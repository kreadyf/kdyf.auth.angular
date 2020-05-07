// Angular
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {NgModule, ModuleWithProviders} from '@angular/core';
// NGRX
import {reducer} from './auth.reducer';
import {StoreModule} from '@ngrx/store';
import {AuthEffects} from './auth.effects';
import {EffectsModule} from '@ngrx/effects';
import {metaReducers} from './auth.meta-reducer';
// Services
import {AuthGuard} from './services/auth-guard.service';
import {AuthService} from './services/auth.service';
import {AuthHttpInterceptor} from './services/auth-http-interceptor.service';
// Others
import {AuthConfig} from './models/auth-config.model';

@NgModule({
  imports: [CommonModule]
})

export class AppAuthTakhiModule {
  static forRoot(config: AuthConfig): ModuleWithProviders {
    return {
      ngModule: RootAuthModule,
      providers: [
        AuthGuard,
        AuthService,
        {provide: 'authConfig', useValue: config},
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
    AppAuthTakhiModule,
    StoreModule.forFeature('auth', reducer, {metaReducers}),
    EffectsModule.forFeature([AuthEffects]),
  ],
})
export class RootAuthModule {
}
