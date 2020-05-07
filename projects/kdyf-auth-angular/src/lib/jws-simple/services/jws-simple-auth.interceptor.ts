// Angular
import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpErrorResponse, HttpResponse, HttpRequest, HttpHandler, HttpEvent} from '@angular/common/http';
// RXJS
import {throwError, Observable} from 'rxjs';
import {tap, catchError, withLatestFrom, exhaustMap} from 'rxjs/operators';
// NGRX
import {ofType} from '@ngrx/effects';
import * as authActions from '../jws-simple.actions';
import {Store, ActionsSubject, Action} from '@ngrx/store';

@Injectable()
export class JwsSimpleAuthInterceptor implements HttpInterceptor {

  authToken: string;

  constructor(private store: Store<any>, private actions: ActionsSubject) {
    this.store.select(s => s.auth.authenticate).pipe(
      tap(auth => this.authToken = auth == null ? null : auth.authToken)
    ).subscribe();

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.addToken(req, this.authToken)).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && (<HttpErrorResponse> error).status === 401) {
          return this.handle401Error(req, next);
        } else {
          return throwError(error); // check
        }
      }));
  }

  addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    if (!token) {
      return req;
    }

    return req.clone({setHeaders: {Authorization: 'Bearer ' + token}});
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.store.dispatch(new authActions.RequestAuthenticationFailure());

    return this.actions.pipe(
      ofType(authActions.AuthActionTypes.AuthenticationSuccess, authActions.AuthActionTypes.AuthenticationFailure),
      withLatestFrom(this.store),
      exhaustMap(([action, storeState]) => {

        // ???
        let act: Action = <Action> action;

        if (act.type == authActions.AuthActionTypes.AuthenticationSuccess) {
          return next.handle(this.addToken(req, storeState.auth.authenticate.authToken));
        } else {
          return throwError(new HttpResponse({status: 401})); // check
        }
      }));
  }

}
