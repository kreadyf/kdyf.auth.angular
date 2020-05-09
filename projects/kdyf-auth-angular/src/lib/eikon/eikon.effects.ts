// Angular
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
// RXJS
import {of} from 'rxjs';
import {catchError, exhaustMap, filter, map, withLatestFrom} from 'rxjs/operators';
// NGRX
import {Store} from '@ngrx/store';
import * as authActions from '../auth.actions';
import {Actions, Effect, ofType} from '@ngrx/effects';
// services
import {EikonService} from './eikon.service';
// Others
import {ProviderType} from '../shared/models/provider.enum';
import {GrantType} from '../shared/models/auth.grant-type.enum';
import {AuthenticateByLogin, AuthenticateBySamlToken} from '../shared/models/auth.models';

@Injectable()
export class EikonEffects {

  constructor(private actions$: Actions,
              private service: EikonService,
              private router: Router,
              private store: Store<any>) {
  }


  @Effect()
  logout$ = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.Logout, authActions.AuthActionTypes.AuthenticationFailure),
    filter((action: any) => action.payload.typeAuth === ProviderType.Eikon),
    map(param => new authActions.LoginRedirect({
      urlRedirect: null,
      typeAuth: ProviderType.Eikon
    }))
  );

  @Effect()
  login$ = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.Login),
    filter((action: any) => action.payload.typeAuth === ProviderType.Eikon),
    map((action: authActions.Login) => action.payload),
    exhaustMap((param: { grantType: GrantType, credentials: AuthenticateByLogin | AuthenticateBySamlToken }) =>
      this.service.login(param.grantType, param.credentials).pipe(
        map(success => new authActions.AuthenticationSuccess(success)),
        catchError(error => of(new authActions.AuthenticationFailure(error)))
      )
    )
  );

  @Effect()
  requestAuthenticationFailure$ = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.RequestAuthenticationFailure),
    filter((action: any) => action.payload.typeAuth === ProviderType.Eikon),
    withLatestFrom(this.store),
    map(([action, storeState]) =>
      storeState.auth.authenticate && storeState.auth.authenticate.refreshToken
        ? new authActions.RefreshToken({refreshToken: storeState.auth.authenticate.refreshToken})
        : new authActions.AuthenticationFailure({validation: 'no-refresh-token', typeAuth: ProviderType.Eikon})
    )
  );

  @Effect()
  refreshToken$ = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.RefreshToken),
    filter((action: any) => action.payload.typeAuth === ProviderType.Eikon),
    exhaustMap((action: authActions.RefreshToken) =>
      this.service.refreshToken(action.payload.refreshToken).pipe(
        map(success => new authActions.AuthenticationSuccess(success)),
        catchError(error => of(new authActions.AuthenticationFailure(error)))
      )
    )
  );

  @Effect({dispatch: false})
  samlInitLogin$ = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.SamlInitLogin),
    filter((action: any) => action.payload.typeAuth === ProviderType.Eikon),
    exhaustMap((action: authActions.AuthActionTypes.SamlInitLogin) =>
      of(this.service.initSaml())
    )
  );

}
