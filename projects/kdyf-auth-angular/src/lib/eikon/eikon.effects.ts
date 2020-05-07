import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {EikonConfigService} from './services/eikon-config.service';
import {
  AuthActionTypes,
  AuthenticationFailure,
  Login,
  AuthenticationSuccess,
  LoginRedirect,
  RefreshToken,
  SamlInitLogin
} from './eikon.actions';
import {Router} from '@angular/router';
import {exhaustMap, map, catchError, withLatestFrom} from 'rxjs/operators';
import {EikonService} from './services/eikon.service';
import {of} from 'rxjs';
import {AuthenticateByLogin, AuthenticateBySamlToken} from '../models/auth.models';
import {Store} from '@ngrx/store';
import {GrantType} from '../models/auth.grant-type.enum';

@Injectable()
export class EikonEffects {

  constructor(private actions$: Actions,
              private config: EikonConfigService,
              private service: EikonService,
              private router: Router,
              private store: Store<any>) {
  }


  @Effect()
  logout$ = this.actions$.pipe(
    ofType(AuthActionTypes.Logout, AuthActionTypes.AuthenticationFailure),
    map(param => new LoginRedirect())
  );

  @Effect()
  login$ = this.actions$.pipe(
    ofType(AuthActionTypes.Login),
    map((action: Login) => action.payload),
    exhaustMap((param: { grantType: GrantType, credentials: AuthenticateByLogin | AuthenticateBySamlToken }) =>
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
      storeState.auth.authenticate && storeState.auth.authenticate.refreshToken
        ? new RefreshToken({refreshToken: storeState.auth.authenticate.refreshToken})
        : new AuthenticationFailure('no-refresh-token')
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

}
