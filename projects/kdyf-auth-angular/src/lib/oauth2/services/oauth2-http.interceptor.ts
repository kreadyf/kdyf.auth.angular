// Angular
import {Injectable} from '@angular/core';
import {HttpRequest, HttpEvent, HttpHandler} from '@angular/common/http';
import {HttpInterceptor, HttpErrorResponse, HttpResponse} from '@angular/common/http';
// RXJS
import {Observable, throwError} from 'rxjs';
import {catchError, finalize, withLatestFrom, exhaustMap} from 'rxjs/operators';
// NGRX
import {ofType} from '@ngrx/effects';
import {Store, ActionsSubject} from '@ngrx/store';
import {RequestAuthenticationOAuth2Failure, OAuth2ActionTypes} from '../oauth2.actions';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {

  isRefreshingToken = false;

  constructor(private store: Store<any>,
              private actions: ActionsSubject) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.addToken(req)).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && (<HttpErrorResponse> error).status === 401) {
          return this.handle401Error(req, next);
        } else {
          return throwError(error);
        }
      }));
  }

  addToken(req: HttpRequest<any>): HttpRequest<any> {
    if (!localStorage.getItem('authenticate')) {
      return req;
    }
    const token = this.loadToken();
    const aux = token.indexOf('apikey') > -1 ? token : 'Bearer ' + token;
    return req.clone({setHeaders: {Authorization: aux}});
  }

  loadToken(): string {
    return JSON.parse(localStorage.getItem('authenticate')).authToken;
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;
      this.store.dispatch(new RequestAuthenticationOAuth2Failure());
    }

    return this.actions.pipe(
      ofType(OAuth2ActionTypes.AuthenticationOAuth2Success, OAuth2ActionTypes.AuthenticationOAuth2Failure),
      withLatestFrom(this.store),
      exhaustMap(([action, storeState]) => {
        if ((<any> action).type === OAuth2ActionTypes.AuthenticationOAuth2Success) {
          return next.handle(this.addToken(req));
        } else {
          return throwError(new HttpResponse({status: 401}));
        }
      }),
      finalize(() => this.isRefreshingToken = false));
  }

}
