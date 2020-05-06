import {Action} from '@ngrx/store';
import {
  User,
  AuthenticateByLogin,
  AuthenticateByRefreshToken,
  AuthenticateResponse,
  AuthenticateBySamlToken,
  AuthenticateByAzureAdToken
} from './models/auth.models';
import {GrantType} from './models/auth.grant-type.enum';

export enum AuthActionTypes {
  Login = '[Auth]Login',
  RefreshToken = '[Auth]RefreshToken',

  AuthenticationSuccess = '[Auth]AuthenticationSuccess',
  AuthenticationFailure = '[Auth]AuthenticationFailure',

  Logout = '[Auth]Logout',

  LoginRedirect = '[Auth]LoginRedirect',

  Authorize = '[Auth]Authorize',
  AuthorizationSuccess = '[Auth]AuthorizationSuccess',
  AuthorizationFailure = '[Auth]AuthorizationFailure',

  RequestAuthenticationFailure = '[Auth]RequestAuthenticationFailure',
  RequestAuthorizationFailure = '[Auth]RequestAuthorizationFailure',

  SamlInitLogin = '[Auth]SamlInitLogin',
  AzureAdInitLogin = '[Auth]AzureAdInitLogin'
}

export type AuthActions =
  | Login
  | RefreshToken
  | AuthenticationSuccess
  | AuthenticationFailure
  | Logout
  | LoginRedirect
  | Authorize
  | AuthorizationSuccess
  | AuthorizationFailure
  | RequestAuthenticationFailure
  | RequestAuthorizationFailure
  | SamlInitLogin
  | AzureAdInitLogin;

export class Login implements Action {
  readonly type = AuthActionTypes.Login;

  constructor(public payload: {
    grantType: GrantType,
    credentials: AuthenticateByLogin | AuthenticateBySamlToken | AuthenticateByAzureAdToken,
    keepLoggedIn: boolean
  }) {
  }
}

export class RefreshToken implements Action {
  readonly type = AuthActionTypes.RefreshToken;

  constructor(public payload: AuthenticateByRefreshToken) {
  }
}

export class AuthenticationSuccess implements Action {
  readonly type = AuthActionTypes.AuthenticationSuccess;

  constructor(public payload: { user: User, authenticate: AuthenticateResponse }) {
  }
}

export class AuthenticationFailure implements Action {
  readonly type = AuthActionTypes.AuthenticationFailure;

  constructor(public payload: string) {
  }
}

export class Authorize implements Action {
  readonly type = AuthActionTypes.Authorize;

  constructor(public authToken: string) {

  }
}

export class AuthorizationFailure implements Action {
  readonly type = AuthActionTypes.AuthorizationFailure;

  constructor(public payload: { error: string }) {
  }
}

export class AuthorizationSuccess implements Action {
  readonly type = AuthActionTypes.AuthorizationSuccess;

  constructor(public payload: { policies: string[] }) {
  }
}

export class Logout implements Action {
  readonly type = AuthActionTypes.Logout;
}

export class LoginRedirect implements Action {
  readonly type = AuthActionTypes.LoginRedirect;

  constructor(public payload: { urlRedirect: string }) {
  }
}

export class RequestAuthenticationFailure implements Action {
  readonly type = AuthActionTypes.RequestAuthenticationFailure;
}

export class RequestAuthorizationFailure implements Action {
  readonly type = AuthActionTypes.RequestAuthorizationFailure;
}

export class SamlInitLogin implements Action {
  readonly type = AuthActionTypes.SamlInitLogin;

  constructor(public payload: { keepLoggedIn: boolean } = {keepLoggedIn: false}) {
  }

}

export class AzureAdInitLogin implements Action {
  readonly type = AuthActionTypes.AzureAdInitLogin;

  constructor(public payload: { keepLoggedIn: boolean } = {keepLoggedIn: false}) {
  }
}
