import {User, AuthenticateResponse} from '../models/auth.models';
import {AzureAdActions, AuthActionTypes} from './azure-ad.actions';

export interface AuthState {
  user: User | undefined;
  authenticate: AuthenticateResponse | undefined;
  keepLoggedIn: boolean;

  pending: boolean;
  initializing: boolean;
  error: string | undefined;

  urlRedirect: string;
}

export const initialState: AuthState = {
  user: undefined,
  authenticate: undefined,
  keepLoggedIn: sessionStorage.getItem('keepLoggedIn') === 'true',
  pending: false,
  initializing: true,
  error: undefined,

  urlRedirect: undefined
};

export function reducer(state: AuthState = initialState, action: AzureAdActions): AuthState {
  switch (action.type) {
    case AuthActionTypes.Login: {
      return {
        ...state,
        keepLoggedIn: action.payload.keepLoggedIn,
        pending: true,
        error: undefined
      };
    }

    case AuthActionTypes.SamlInitLogin: {
      return {
        ...state,
        keepLoggedIn: action.payload.keepLoggedIn,
        pending: true,
        error: undefined
      };
    }

    case AuthActionTypes.AzureAdInitLogin: {
      return {
        ...state,
        keepLoggedIn: action.payload.keepLoggedIn,
        pending: true,
        error: undefined
      };
    }

    case AuthActionTypes.RefreshToken: {
      return {
        ...state,
        error: undefined,
        pending: true
      };
    }

    case AuthActionTypes.AuthenticationSuccess: {

      localStorage.setItem('authenticate', JSON.stringify(action.payload.authenticate));

      return {
        ...state,
        authenticate: action.payload.authenticate,
        user: {
          ...action.payload.user,
          policies: state.user ? state.user.policies : []
        },
        pending: false,
        error: undefined
      };
    }

    case AuthActionTypes.AuthenticationFailure: {

      localStorage.removeItem('authenticate');

      return {
        ...state,
        error: action.payload,
        pending: false,
        user: undefined,
        authenticate: undefined
      };
    }

    case AuthActionTypes.Authorize: {
      return {
        ...state,
        pending: true,
        error: undefined
      };
    }

    case AuthActionTypes.AuthorizationSuccess: {
      return {
        ...state,
        pending: false,
        initializing: false,
        error: undefined,
        user: {
          ...state.user,
          policies: action.payload.policies
        }
      };
    }

    case AuthActionTypes.AuthorizationFailure: {
      return {
        ...state,
        pending: false,
        initializing: false,
        error: action.payload.error
      };
    }

    case AuthActionTypes.Logout: {

      localStorage.removeItem('authenticate');

      return {
        ...state,
        error: undefined,
        pending: false,
        user: undefined,
        authenticate: undefined
      };
    }

    case AuthActionTypes.LoginRedirect: {
      return {
        ...state,
        pending: false,
        initializing: false,
        urlRedirect: action.payload.urlRedirect
      };
    }

    default:
      return state;
  }
}