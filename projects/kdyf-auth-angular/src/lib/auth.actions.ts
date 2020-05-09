import {Action} from '@ngrx/store';
import {
  User,
  AuthenticateByLogin,
  AuthenticateByRefreshToken,
  AuthenticateResponse,
  AuthenticateBySamlToken,
  AuthenticateByAzureAdToken
} from './shared/models/auth.models';
import {GrantType} from './shared/models/auth.grant-type.enum';
import {ProviderType} from './shared/models/provider.enum';

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

export class Login implements Action {
  readonly type = AuthActionTypes.Login;

  constructor(public payload: {
    grantType?: GrantType,
    credentials?: AuthenticateByLogin | AuthenticateBySamlToken | AuthenticateByAzureAdToken,
    typeAuth?: ProviderType,
    keepLoggedIn?: boolean
  }) {
  }
}

export class RefreshToken implements Action {
  readonly type = AuthActionTypes.RefreshToken;

  constructor(public payload: { refreshToken: AuthenticateByRefreshToken, typeAuth?: ProviderType }) {
  }
}

export class AuthenticationSuccess implements Action {
  readonly type = AuthActionTypes.AuthenticationSuccess;

  constructor(public payload: { user: User, authenticate: AuthenticateResponse, typeAuth?: ProviderType }) {
  }
}

export class AuthenticationFailure implements Action {
  readonly type = AuthActionTypes.AuthenticationFailure;

  constructor(public payload: { validation: string, typeAuth?: ProviderType }) {
  }
}

export class Authorize implements Action {
  readonly type = AuthActionTypes.Authorize;

  constructor(public payload: { authToken: string, typeAuth?: ProviderType }) {

  }
}

export class AuthorizationFailure implements Action {
  readonly type = AuthActionTypes.AuthorizationFailure;

  constructor(public payload: { validation: string, typeAuth?: ProviderType }) {
  }
}

export class AuthorizationSuccess implements Action {
  readonly type = AuthActionTypes.AuthorizationSuccess;

  constructor(public payload: { policies: string[], typeAuth?: ProviderType }) {
  }
}

export class Logout implements Action {
  readonly type = AuthActionTypes.Logout;

  constructor(public payload: { typeAuth?: ProviderType }) {
  }
}

export class LoginRedirect implements Action {
  readonly type = AuthActionTypes.LoginRedirect;

  constructor(public payload: { urlRedirect: string, typeAuth?: ProviderType }) {
  }
}

export class RequestAuthenticationFailure implements Action {
  readonly type = AuthActionTypes.RequestAuthenticationFailure;

  constructor(public payload: { typeAuth?: ProviderType }) {
  }
}

export class RequestAuthorizationFailure implements Action {
  readonly type = AuthActionTypes.RequestAuthorizationFailure;

  constructor(public payload: { typeAuth?: ProviderType }) {
  }
}

export class SamlInitLogin implements Action {
  readonly type = AuthActionTypes.SamlInitLogin;

  constructor(public payload: { keepLoggedIn: boolean, typeAuth?: ProviderType } = {keepLoggedIn: false}) {
  }

}

export class AzureAdInitLogin implements Action {
  readonly type = AuthActionTypes.AzureAdInitLogin;

  constructor(public payload?: { keepLoggedIn: boolean, typeAuth?: ProviderType }) {
  }
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
