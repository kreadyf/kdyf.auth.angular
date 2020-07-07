import {Action} from '@ngrx/store';
import {AuthenticateOAuth2Response} from './models/oauth2.model';

export enum OAuth2ActionTypes {
  AuthenticationOAuth2Success = '[OAuth2]AuthenticationSuccess',
  AuthenticationOAuth2Failure = '[OAuth2]AuthenticationFailure',

  LogoutOAuth2 = '[OAuth2]Logout',

  LoginRedirectOAuth2 = '[OAuth2]LoginRedirect',

  AuthorizeOAuth2 = '[OAuth2]Authorize',
  AuthorizationOAuth2Success = '[OAuth2]AuthorizationSuccess',
  AuthorizationOAuth2Failure = '[OAuth2]AuthorizationFailure',

  RequestAuthenticationOAuth2Failure = '[OAuth2]RequestAuthenticationFailure',
  RequestAuthorizationOAuth2Failure = '[OAuth2]RequestAuthorizationFailure',

  InavInitLogin = '[OAuth2]AzureAdInitLogin',

  GetUserAction = '[OAuth2]GetUserAction',
  GetUserSuccess = '[OAuth2]GetUserSuccess',
  GetUserFailure = '[OAuth2]GetUserFailure'
}

export class GetUserAction implements Action {
  readonly type = OAuth2ActionTypes.GetUserAction;
}

export class GetUserSuccess implements Action {
  readonly type = OAuth2ActionTypes.GetUserSuccess;

  constructor(public payload: { user: any }) {
  }
}

export class GetUserFailure implements Action {
  readonly type = OAuth2ActionTypes.GetUserFailure;

  constructor(public payload: { validation: any }) {
  }
}

export class AuthenticationOAuth2Success implements Action {
  readonly type = OAuth2ActionTypes.AuthenticationOAuth2Success;

  constructor(public payload: { authenticate: AuthenticateOAuth2Response }) {
  }
}

export class AuthenticationOAuth2Failure implements Action {
  readonly type = OAuth2ActionTypes.AuthenticationOAuth2Failure;

  constructor(public payload: string) {
  }
}

export class AuthorizeOAuth2 implements Action {
  readonly type = OAuth2ActionTypes.AuthorizeOAuth2;

  constructor(public authToken: string) {

  }
}

export class AuthorizationOAuth2Failure implements Action {
  readonly type = OAuth2ActionTypes.AuthorizationOAuth2Failure;

  constructor(public payload: { error: string }) {
  }
}

export class AuthorizationOAuth2Success implements Action {
  readonly type = OAuth2ActionTypes.AuthorizationOAuth2Success;
}

export class LogoutOAuth2 implements Action {
  readonly type = OAuth2ActionTypes.LogoutOAuth2;
}

export class LoginRedirectOAuth2 implements Action {
  readonly type = OAuth2ActionTypes.LoginRedirectOAuth2;

  constructor(public payload: { urlRedirect: string }) {
  }
}

export class RequestAuthenticationOAuth2Failure implements Action {
  readonly type = OAuth2ActionTypes.RequestAuthenticationOAuth2Failure;
}

export class RequestAuthorizationOAuth2Failure implements Action {
  readonly type = OAuth2ActionTypes.RequestAuthorizationOAuth2Failure;
}

export class InavInitLogin implements Action {
  readonly type = OAuth2ActionTypes.InavInitLogin;
}

export type Oauth2Actions =
  | AuthenticationOAuth2Success
  | AuthenticationOAuth2Failure
  | LogoutOAuth2
  | LoginRedirectOAuth2
  | AuthorizeOAuth2
  | AuthorizationOAuth2Success
  | AuthorizationOAuth2Failure
  | RequestAuthenticationOAuth2Failure
  | RequestAuthorizationOAuth2Failure
  | InavInitLogin

  | GetUserAction
  | GetUserSuccess
  | GetUserFailure;
