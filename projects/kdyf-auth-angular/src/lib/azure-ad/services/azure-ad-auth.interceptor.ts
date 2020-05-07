// Angular
import {Injectable} from '@angular/core';
import {HttpRequest, HttpEvent, HttpHandler} from '@angular/common/http';
import {HttpInterceptor, HttpErrorResponse, HttpResponse} from '@angular/common/http';
// RXJS
import {BehaviorSubject, Observable, throwError, timer} from 'rxjs';
import {catchError, finalize, withLatestFrom, exhaustMap, switchMap, tap} from 'rxjs/operators';
// NGRX
import {ofType} from '@ngrx/effects';
import {Store, ActionsSubject} from '@ngrx/store';
import * as auth_actions from '../azure-ad.actions';
import {RequestAuthenticationFailure, AuthActionTypes} from '../azure-ad.actions';
// Services
import {AuthAzureAdService} from './auth-azure-ad.service';

@Injectable()
export class AzureAdAuthInterceptor implements HttpInterceptor {

  isRefreshingToken: boolean = false;
  heartbeatSubs = new BehaviorSubject(null);

  constructor(private authService: AuthAzureAdService,
              private store: Store<any>,
              private actions: ActionsSubject) {

    this.heartbeatSubs.pipe(
      switchMap(value => timer(120000)),
      tap(s => {
        const token = localStorage.getItem('authenticate') ?
          JSON.parse(localStorage.getItem('authenticate')).authToken : undefined;
        token ? this.store.dispatch(new auth_actions.Authorize(token)) : '';
      })
    ).subscribe();

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.heartbeatSubs.next(null);

    return next.handle(this.addToken(req)).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && (<HttpErrorResponse> error).status == 401) {
          return this.handle401Error(req, next);
        } else {
          return throwError(error); // check
        }
      }));

  }

  addToken(req: HttpRequest<any>): HttpRequest<any> {
    if (!localStorage.getItem('authenticate')) {
      return req;
    }
    return req.clone({setHeaders: {Authorization: 'Bearer ' + this.loadToken()}});
  }

  loadToken() {
    return JSON.parse(localStorage.getItem('authenticate')).authToken;
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;
      this.store.dispatch(new RequestAuthenticationFailure());
    }

    return this.actions.pipe(
      ofType(AuthActionTypes.AuthenticationSuccess, AuthActionTypes.AuthenticationFailure),
      withLatestFrom(this.store),
      exhaustMap(([action, storeState]) => {

        if ((<any> action).type == AuthActionTypes.AuthenticationSuccess) {
          return next.handle(this.addToken(req));
        } else {
          return throwError(new HttpResponse({status: 401})); // check
        }
      }),
      finalize(() => {
        this.isRefreshingToken = false;
      }));
  }

}
