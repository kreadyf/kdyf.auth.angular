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
// Services
import {JwsSimpleService} from './jws-simple.service';
// Others
import {ProviderType} from '../shared/models/provider.enum';
import {AuthenticateByLogin} from '../shared/models/auth.models';

@Injectable()
export class JwsSimpleEffects {

  constructor(private actions$: Actions,
              private service: JwsSimpleService,
              private router: Router,
              private store: Store<any>) {
  }

  @Effect()
  logout$ = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.Logout, authActions.AuthActionTypes.AuthenticationFailure),
    filter((action: any) => action.payload.typeAuth === ProviderType.JwsSimple),
    map(param => new authActions.LoginRedirect({
      urlRedirect: null,
      typeAuth: ProviderType.JwsSimple
    }))
  );

  @Effect()
  login$ = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.Login),
    filter((action: any) => action.payload.typeAuth === ProviderType.JwsSimple),
    map((action: authActions.Login) => action.payload),
    exhaustMap((param: { credentials: AuthenticateByLogin }) =>
      this.service.login(param.credentials).pipe(
        map(success => new authActions.AuthenticationSuccess({
          user: success.user,
          authenticate: success.authenticate,
          typeAuth: ProviderType.JwsSimple
        })),
        catchError(error => of(new authActions.AuthenticationFailure({
          validation: error,
          typeAuth: ProviderType.JwsSimple
        })))
      )
    )
  );

  @Effect()
  requestAuthenticationFailure$ = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.RequestAuthenticationFailure),
    filter((action: any) => action.payload.typeAuth === ProviderType.JwsSimple),
    withLatestFrom(this.store),
    map(([action, storeState]) =>
      new authActions.AuthenticationFailure({
        validation: 'temp',
        typeAuth: ProviderType.JwsSimple
      })
    )
  );

}
