// Angular
import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
// RXJS
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, exhaustMap, finalize, tap, withLatestFrom} from 'rxjs/operators';
// NGRX
import {ofType} from '@ngrx/effects';
import * as authActions from '../auth.actions';
import {ActionsSubject, Store} from '@ngrx/store';
import {ProviderType} from '../shared/models/provider.enum';

@Injectable()
export class EikonAuthInterceptor implements HttpInterceptor {

  isRefreshingToken = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

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
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;
      this.store.dispatch(new authActions.RequestAuthenticationFailure({typeAuth: ProviderType.Eikon}));
    }

    return this.actions.pipe(
      ofType(authActions.AuthActionTypes.AuthenticationSuccess, authActions.AuthActionTypes.AuthenticationFailure),
      withLatestFrom(this.store),
      exhaustMap(([action, storeState]: any) => {

        if (action.type === authActions.AuthActionTypes.AuthenticationSuccess) {
          return next.handle(this.addToken(req, storeState.auth.authenticate.authToken));
        } else {
          return throwError(new HttpResponse({status: 401})); // check
        }
      }),
      finalize(() => {
        this.isRefreshingToken = false;
      }));
  }

}
