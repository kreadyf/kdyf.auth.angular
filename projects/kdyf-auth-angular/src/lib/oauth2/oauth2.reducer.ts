import {AuthenticateOAuth2Response} from './models/oauth2.model';
import {Oauth2Actions, OAuth2ActionTypes} from './oauth2.actions';

export interface OAuth2State {
  user: any;
  authenticate: AuthenticateOAuth2Response;
  urlRedirect: string;
}

export const initialState: OAuth2State = {
  user: undefined,
  authenticate: {
    authToken: 'apikey jf728qiakjwng26s6d8fg9ajrn93d2d7stgqadlsze84'
  },
  urlRedirect: '/home'
};

export function reducer(state: OAuth2State = initialState, action: Oauth2Actions): OAuth2State {
  switch (action.type) {

    case OAuth2ActionTypes.AuthenticationOAuth2Success: {
      localStorage.setItem('authenticate', JSON.stringify(action.payload.authenticate));
      return {
        ...state,
        authenticate: action.payload.authenticate
      };
    }

    case OAuth2ActionTypes.AuthenticationOAuth2Failure: {
      localStorage.removeItem('authenticate');
      return {
        ...state,
        authenticate: undefined
      };
    }

    case OAuth2ActionTypes.LogoutOAuth2: {
      localStorage.removeItem('authenticate');
      return initialState;
    }

    case OAuth2ActionTypes.LoginRedirectOAuth2: {
      return {
        ...state,
        urlRedirect: action.payload.urlRedirect
      };
    }
    case OAuth2ActionTypes.GetUserSuccess: {
      return {
        ...state,
        user: action.payload.user
      };
    }
    default:
      return state;
  }

}
