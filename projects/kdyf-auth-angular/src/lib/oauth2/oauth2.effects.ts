// Angular
import {Injectable} from '@angular/core';
// RXJS
import {of} from 'rxjs';
import {catchError, exhaustMap, map} from 'rxjs/operators';
// NGRX
import * as oauth2Actions from './oauth2.actions';
import {Actions, Effect, ofType} from '@ngrx/effects';
// Services
import {Oauth2Service} from './services/oauth2.service';

@Injectable()
export class Oauth2Effects {

  constructor(private actions$: Actions,
              private service: Oauth2Service) {
  }

  @Effect()
  authenticationSuccess$ = this.actions$.pipe(
    ofType(oauth2Actions.OAuth2ActionTypes.AuthenticationOAuth2Success),
    map((action: any) => new oauth2Actions.AuthorizeOAuth2(action.payload.authenticate.authToken))
  );

  @Effect()
  authorize$ = this.actions$.pipe(
    ofType(oauth2Actions.OAuth2ActionTypes.AuthorizeOAuth2),
    map((action: any) => new oauth2Actions.AuthorizationOAuth2Success())
  );

  @Effect({dispatch: false})
  azureAdInitLogin$ = this.actions$.pipe(
    ofType(oauth2Actions.OAuth2ActionTypes.InavInitLogin),
    exhaustMap((action: any) =>
      of(this.service.initInav())
    )
  );

  @Effect()
  getUser$ = this.actions$.pipe(
    ofType(oauth2Actions.OAuth2ActionTypes.GetUserAction),
    exhaustMap((action: any) =>
      this.service.getUser().pipe(
        map(success => new oauth2Actions.GetUserSuccess({user: success.body})),
        catchError(error => of(new oauth2Actions.GetUserFailure(error)))
      )
    )
  );

}
