// NGRX
import {AuthActions, AuthActionTypes} from '../auth.actions';
// Others
import {User, AuthenticateResponse} from '../shared/models/auth.models';

export interface AuthState {
  user: User | undefined;
  authenticate: AuthenticateResponse | undefined;

  pending: boolean;
  error: string | undefined;
}

export const initialState: AuthState = {
  user: undefined,
  authenticate: undefined,
  pending: false,
  error: undefined
};

export function reducer(state: AuthState = initialState, action: AuthActions): AuthState {

  switch (action.type) {
    case AuthActionTypes.Login: {
      return {
        ...state,
        pending: true,
        error: undefined
      };
    }

    case AuthActionTypes.AuthenticationSuccess: {
      return {
        ...state,
        authenticate: action.payload.authenticate,
        user: action.payload.user,
        pending: false,
        error: undefined
      };
    }

    case AuthActionTypes.AuthenticationFailure: {
      return {
        ...state,
        error: action.payload.validation,
        pending: false,
        user: undefined,
        authenticate: undefined
      };
    }

    case AuthActionTypes.Logout: {
      return {
        ...state,
        error: undefined,
        pending: false,
        user: undefined,
        authenticate: undefined
      };
    }

    default:
      return state;
  }
}
