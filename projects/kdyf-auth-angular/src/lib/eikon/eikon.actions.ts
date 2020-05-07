import {Action} from '@ngrx/store';
import {User, AuthenticateByLogin, AuthenticateByRefreshToken, AuthenticateResponse, AuthenticateBySamlToken} from '../models/auth.models';
import {GrantType} from '../models/auth.grant-type.enum';

export enum AuthActionTypes {
  Login = '[Auth]Login',
  RefreshToken = '[Auth]RefreshToken',

  AuthenticationSuccess = '[Auth]AuthenticationSuccess',
  AuthenticationFailure = '[Auth]AuthenticationFailure',

  Logout = '[Auth]Logout',

  LoginRedirect = '[Auth]LoginRedirect',

  RequestAuthenticationFailure = '[Auth]RequestAuthenticationFailure',
  RequestAuthorizationFailure = '[Auth]RequestAuthorizationFailure',

  SamlInitLogin = '[Auth]SamlInitLogin'
}

export class Login implements Action {
  readonly type = AuthActionTypes.Login;

  constructor(public payload: { grantType: GrantType, credentials: AuthenticateByLogin | AuthenticateBySamlToken }) {
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

export class Logout implements Action {
  readonly type = AuthActionTypes.Logout;
}

export class LoginRedirect implements Action {
  readonly type = AuthActionTypes.LoginRedirect;

  constructor() {
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
}

export type EikonActions =
  | Login
  | RefreshToken
  | AuthenticationSuccess
  | AuthenticationFailure
  | Logout
  | LoginRedirect
  | RequestAuthenticationFailure
  | RequestAuthorizationFailure
  | SamlInitLogin;
