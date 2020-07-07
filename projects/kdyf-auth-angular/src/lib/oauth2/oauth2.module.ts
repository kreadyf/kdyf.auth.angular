// Angular
import {CommonModule} from '@angular/common';
import {NgModule, ModuleWithProviders} from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
// NGRX
import {StoreModule} from '@ngrx/store';
import {reducer} from './oauth2.reducer';
import {EffectsModule} from '@ngrx/effects';
import {Oauth2Effects} from './oauth2.effects';
import {metaReducers} from './oauth2.meta-reducer';
// Services
import {Oauth2Service} from './services/oauth2.service';
// Interceptors
import {AuthHttpInterceptor} from './services/oauth2-http.interceptor';
// Others
import {OAuth2Config} from './models/oauth2-config.model';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ]
})

export class Oauth2Module {
  static forRoot(config: OAuth2Config): ModuleWithProviders<any> {
    return {
      ngModule: RootOAuth2Module,
      providers: [
        Oauth2Service,
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
    Oauth2Module,
    StoreModule.forFeature('OAuth2', reducer, {metaReducers}),
    EffectsModule.forFeature([Oauth2Effects]),
  ],
})

export class RootOAuth2Module {
}
