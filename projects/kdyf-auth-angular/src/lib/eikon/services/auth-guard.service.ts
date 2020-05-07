import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, filter, catchError, mergeMap, take, last, tap, switchMap, first, finalize, single  } from 'rxjs/operators';
import * as Auth from '../auth.actions';
import { AuthState } from '../auth.reducer';
import { AuthConfig } from '../models/auth-config.model';
import { AuthConfigService } from './auth-config.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store<any>, private config: AuthConfigService) {}
  /*
  How can I remove the dependency to ApplicationState?
  If I incect AuthState it compiles, but still the ApplicationState will be injected with the store
  */

  canActivate(): Observable<boolean> {
    return this.store.pipe(
      select(s=>s.auth.user),
      map(user => {
        if (!user) {
          this.store.dispatch(new Auth.LoginRedirect());
          return false;
        }
        return true;
      }), take(1));
    ;
  }
}
