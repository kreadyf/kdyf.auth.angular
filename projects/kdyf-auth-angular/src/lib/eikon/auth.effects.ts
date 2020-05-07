import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { AuthConfigService } from './services/auth-config.service';
import { AuthActionTypes, AuthenticationFailure, Login, AuthenticationSuccess, LoginRedirect, RequestAuthenticationFailure, Logout, RefreshToken, SamlInitLogin } from './auth.actions';
import { Router } from "@angular/router";
import { tap, exhaustMap, map, catchError, take, withLatestFrom } from "rxjs/operators";
import { AuthService } from './services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { of, Observable, defer } from 'rxjs';
import { AuthenticateByLogin, AuthenticateBySamlToken } from './models/auth.models';
import { Action, Store, select } from "@ngrx/store";
import { AuthState } from "./auth.reducer";
import { GrantType } from './models/auth.grant-type.enum';


@Injectable()
export class AuthEffects {

  constructor(
    private actions$: Actions,
    private config: AuthConfigService,
    private service: AuthService,
    private router: Router,
    private store: Store<any>
  ) {}


  @Effect()
  logout$ = this.actions$.pipe(
    ofType(AuthActionTypes.Logout, AuthActionTypes.AuthenticationFailure),
    map(param=>new LoginRedirect())
  );

  @Effect()
  login$ = this.actions$.pipe(
    ofType(AuthActionTypes.Login),
    map((action:Login)=>action.payload),
    exhaustMap((param:{grantType: GrantType, credentials:AuthenticateByLogin|AuthenticateBySamlToken})=>
       this.service.login(param.grantType, param.credentials).pipe(
         map(success=>new AuthenticationSuccess(success)),
         catchError(error=>of(new AuthenticationFailure(error)))
       )
    )
  );

  @Effect()
  requestAuthenticationFailure$ = this.actions$.pipe(
    ofType(AuthActionTypes.RequestAuthenticationFailure),
    withLatestFrom(this.store),
    map(([action, storeState])=>
      storeState.auth.authenticate && storeState.auth.authenticate.refreshToken
      ? new RefreshToken({refreshToken: storeState.auth.authenticate.refreshToken})
      : new AuthenticationFailure("no-refresh-token")
    )
  );

  @Effect()
  refreshToken$ = this.actions$.pipe(
    ofType(AuthActionTypes.RefreshToken),
    exhaustMap((action:RefreshToken)=>
       this.service.refreshToken({refreshToken: action.payload.refreshToken}).pipe(
         map(success=>new AuthenticationSuccess(success)),
         catchError(error=>of(new AuthenticationFailure(error)))
       )
    )
  );

  @Effect({dispatch: false})
  samlInitLogin$ = this.actions$.pipe(
    ofType(AuthActionTypes.SamlInitLogin),
    exhaustMap((action:SamlInitLogin)=>
       of(this.service.initSaml())
    )
  );

}
