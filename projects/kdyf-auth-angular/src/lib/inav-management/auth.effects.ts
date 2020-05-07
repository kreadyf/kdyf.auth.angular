import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {
  AuthActionTypes,
  AuthenticationFailure,
  Login,
  AuthenticationSuccess,
  LoginRedirect,
  RefreshToken,
  SamlInitLogin, AzureAdInitLogin, Authorize, AuthorizationSuccess, AuthorizationFailure
} from './auth.actions';
import {Router} from '@angular/router';
import {exhaustMap, map, catchError, withLatestFrom} from 'rxjs/operators';
import {AuthService} from './services/auth.service';
import {of} from 'rxjs';
import {AuthenticateByLogin, AuthenticateBySamlToken} from './models/auth.models';
import {Store} from '@ngrx/store';
import {GrantType} from './models/auth.grant-type.enum';


@Injectable()
export class AuthEffects {

  constructor(
    private actions$: Actions,
    private service: AuthService,
    private router: Router,
    private store: Store<any>) {
  }

  @Effect()
  logout$ = this.actions$.pipe(
    ofType(AuthActionTypes.Logout, AuthActionTypes.AuthenticationFailure, AuthActionTypes.AuthorizationFailure),
    withLatestFrom(this.store),
    map(([action, storeState]) => new LoginRedirect({urlRedirect: this.router.url !== '/eikon/login' ? this.router.url : storeState.auth.urlRedirect}))
  );

  @Effect()
  login$ = this.actions$.pipe(
    ofType(AuthActionTypes.Login),
    map((action: Login) => action.payload),
    exhaustMap((param: { grantType: GrantType, credentials: AuthenticateByLogin | AuthenticateBySamlToken, keepLoggedIn: boolean }) =>
      this.service.login(param.grantType, param.credentials).pipe(
        map(success => new AuthenticationSuccess(success)),
        catchError(error => of(new AuthenticationFailure(error)))
      )
    )
  );

  @Effect()
  requestAuthenticationFailure$ = this.actions$.pipe(
    ofType(AuthActionTypes.RequestAuthenticationFailure),
    withLatestFrom(this.store),
    map(([action, storeState]) =>
      localStorage.getItem('authenticate') && (JSON.parse(localStorage.getItem('authenticate'))).refreshToken
        ? new RefreshToken({refreshToken: (JSON.parse(localStorage.getItem('authenticate'))).refreshToken})
        : new AuthenticationFailure('no-refresh-token')
    )
  );

  @Effect()
  authenticationSuccess$ = this.actions$.pipe(
    ofType(AuthActionTypes.AuthenticationSuccess),
    map((action: AuthenticationSuccess) => new Authorize(action.payload.authenticate.authToken))
  );

  @Effect()
  authorize$ = this.actions$.pipe(
    ofType(AuthActionTypes.Authorize),
    exhaustMap((action: Authorize) => {
        return action.authToken
          ? this.service.checkAndUpdateAuthorization().pipe(
            map(policies => new AuthorizationSuccess({policies: policies})),
            catchError(error => of(new AuthorizationFailure({error: error}))))
          : of(new AuthorizationSuccess({policies: []}));
      }
    )
  );

  @Effect()
  refreshToken$ = this.actions$.pipe(
    ofType(AuthActionTypes.RefreshToken),
    exhaustMap((action: RefreshToken) =>
      this.service.refreshToken({refreshToken: action.payload.refreshToken}).pipe(
        map(success => new AuthenticationSuccess(success)),
        catchError(error => of(new AuthenticationFailure(error)))
      )
    )
  );

  @Effect({dispatch: false})
  samlInitLogin$ = this.actions$.pipe(
    ofType(AuthActionTypes.SamlInitLogin),
    exhaustMap((action: SamlInitLogin) =>
      of(this.service.initSaml())
    )
  );

  @Effect({dispatch: false})
  azureAdInitLogin$ = this.actions$.pipe(
    ofType(AuthActionTypes.AzureAdInitLogin),
    exhaustMap((action: AzureAdInitLogin) =>
      of(this.service.initAzureAd())
    )
  );

}
