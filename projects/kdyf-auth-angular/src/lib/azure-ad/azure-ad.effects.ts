// Angular
import {Router} from '@angular/router';
import {Inject, Injectable} from '@angular/core';
// RXJS
import {of} from 'rxjs';
import {catchError, exhaustMap, filter, map, withLatestFrom} from 'rxjs/operators';
// NGRX
import {Store} from '@ngrx/store';
import * as authActions from '../auth.actions';
import {Actions, Effect, ofType} from '@ngrx/effects';
// Services
import {AuthAzureAdService} from './auth-azure-ad.service';
// Others
import {ProviderType} from '../shared/models/provider.enum';
import {GrantType} from '../shared/models/auth.grant-type.enum';
import {Configuration} from '../shared/models/configuration.model';
import {AuthenticateByLogin, AuthenticateBySamlToken} from '../shared/models/auth.models';

@Injectable()
export class AzureAdEffects {

  config: Configuration;

  constructor(private actions$: Actions,
              private service: AuthAzureAdService,
              private router: Router,
              private store: Store<any>,
              @Inject('authConfig') private configuration: Configuration[]) {

    const index = this.configuration.findIndex((item: Configuration) => item.providerType === ProviderType.AzureAd);
    this.config = this.configuration[index];

  }

  @Effect()
  logout$ = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.Logout,
      authActions.AuthActionTypes.AuthenticationFailure,
      authActions.AuthActionTypes.AuthorizationFailure),
    filter((action: any) => action.payload.typeAuth === ProviderType.AzureAd),
    withLatestFrom(this.store),
    map(([action, storeState]) => new authActions.LoginRedirect({
      urlRedirect: this.router.url !== this.config.authConfig.pathLogin ? this.router.url : storeState.auth.urlRedirect,
      typeAuth: ProviderType.AzureAd
    }))
  );

  @Effect()
  login$ = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.Login),
    filter((action: any) => action.payload.typeAuth === ProviderType.AzureAd),
    map((action: authActions.Login) => action.payload),
    exhaustMap((param: {
        grantType: GrantType,
        credentials: AuthenticateByLogin | AuthenticateBySamlToken,
        typeAuth: ProviderType.AzureAd,
        keepLoggedIn: boolean
      }) =>
        this.service.login(param.grantType, param.credentials).pipe(
          map(success => new authActions.AuthenticationSuccess({
            user: success.user,
            authenticate: success.authenticate,
            typeAuth: ProviderType.AzureAd
          })),
          catchError(error => of(new authActions.AuthenticationFailure({
            validation: error,
            typeAuth: ProviderType.AzureAd
          })))
        )
    )
  );

  @Effect()
  requestAuthenticationFailure$ = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.RequestAuthenticationFailure),
    filter((action: any) => action.payload.typeAuth === ProviderType.AzureAd),
    withLatestFrom(this.store),
    map(([action, storeState]) =>
      localStorage.getItem('authenticate') && (JSON.parse(localStorage.getItem('authenticate'))).refreshToken
        ? new authActions.RefreshToken({
          refreshToken: (JSON.parse(localStorage.getItem('authenticate'))).refreshToken,
          typeAuth: ProviderType.AzureAd
        })
        : new authActions.AuthenticationFailure({
          validation: 'no-refresh-token',
          typeAuth: ProviderType.AzureAd
        })
    )
  );

  @Effect()
  authenticationSuccess$ = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.AuthenticationSuccess),
    filter((action: any) => action.payload.typeAuth === ProviderType.AzureAd),
    map((action: authActions.AuthenticationSuccess) => new authActions.Authorize({
      authToken: action.payload.authenticate.authToken,
      typeAuth: ProviderType.AzureAd
    }))
  );

  @Effect()
  authorize$ = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.Authorize),
    filter((action: any) => action.payload.typeAuth === ProviderType.AzureAd),
    exhaustMap((action: any) => {
        return action.authToken
          ? this.service.checkAndUpdateAuthorization().pipe(
            map(policies => new authActions.AuthorizationSuccess({
              policies: policies,
              typeAuth: ProviderType.AzureAd
            })),
            catchError(error => of(new authActions.AuthorizationFailure({
              validation: error,
              typeAuth: ProviderType.AzureAd
            }))))
          : of(new authActions.AuthorizationSuccess({
            policies: [],
            typeAuth: ProviderType.AzureAd
          }));
      }
    )
  );

  @Effect()
  refreshToken$ = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.RefreshToken),
    filter((action: any) => action.payload.typeAuth === ProviderType.AzureAd),
    exhaustMap((action: authActions.RefreshToken) =>
      this.service.refreshToken(action.payload.refreshToken).pipe(
        map((success: any) => new authActions.AuthenticationSuccess({
          user: success.user,
          authenticate: success.authenticate,
          typeAuth: ProviderType.AzureAd
        })),
        catchError(error => of(new authActions.AuthenticationFailure({
          validation: error,
          typeAuth: ProviderType.AzureAd
        })))
      )
    )
  );

  @Effect({dispatch: false})
  samlInitLogin$ = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.SamlInitLogin),
    filter((action: any) => action.payload.typeAuth === ProviderType.AzureAd),
    exhaustMap((action: authActions.SamlInitLogin) =>
      of(this.service.initSaml())
    )
  );

  @Effect({dispatch: false})
  azureAdInitLogin$ = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.AzureAdInitLogin),
    filter((action: any) => action.payload.typeAuth === ProviderType.AzureAd),
    exhaustMap((action: authActions.AuthActionTypes.AzureAdInitLogin) =>
      of(this.service.initAzureAd())
    )
  );

}
