// Angular
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
// RXJS
import {of} from 'rxjs';
import {exhaustMap, map, catchError, withLatestFrom} from 'rxjs/operators';
// NGRX
import {Store} from '@ngrx/store';
import * as authActions from './auth.actions';
import {Actions, Effect, ofType} from '@ngrx/effects';
// Services
import {AuthService} from './services/auth.service';
import {AuthenticateByLogin} from './models/auth.models';

@Injectable()
export class AuthEffects {

  constructor(private actions$: Actions,
              private service: AuthService,
              private router: Router,
              private store: Store<any>) {
  }

  @Effect()
  logout$ = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.Logout, authActions.AuthActionTypes.AuthenticationFailure),
    map(param => new authActions.LoginRedirect())
  );

  @Effect()
  login$ = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.Login),
    map((action: authActions.Login) => action.payload),
    exhaustMap((param: { credentials: AuthenticateByLogin }) =>
      this.service.login(param.credentials).pipe(
        map(success => new authActions.AuthenticationSuccess(success)),
        catchError(error => of(new authActions.AuthenticationFailure(error)))
      )
    )
  );

  @Effect()
  requestAuthenticationFailure$ = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.RequestAuthenticationFailure),
    withLatestFrom(this.store),
    map(([action, storeState]) =>
      new authActions.AuthenticationFailure('temp')
    )
  );

}
