import {Observable, throwError} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {HttpRequest} from '@angular/common/http';
import {HttpHandler} from '@angular/common/http';
import {HttpEvent} from '@angular/common/http';
import 'rxjs/add/observable/fromPromise';
import {Store, ActionsSubject} from '@ngrx/store';
import {BehaviorSubject} from 'rxjs';
import {tap, catchError, finalize, withLatestFrom, exhaustMap} from 'rxjs/operators';
import {RequestAuthenticationFailure, AuthActionTypes} from '../eikon.actions';
import {ofType} from '@ngrx/effects';

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
      this.store.dispatch(new RequestAuthenticationFailure());
    }

    return this.actions.pipe(
      ofType(AuthActionTypes.AuthenticationSuccess, AuthActionTypes.AuthenticationFailure),
      withLatestFrom(this.store),
      exhaustMap(([action, storeState]: any) => {

        if (action.type === AuthActionTypes.AuthenticationSuccess) {
          return next.handle(this.addToken(req, storeState.auth.authenticate.authToken));
        } else {
          return Observable.throw(new HttpResponse({status: 401})); // check
        }
      }),
      finalize(() => {
        this.isRefreshingToken = false;
      }));
  }

}
