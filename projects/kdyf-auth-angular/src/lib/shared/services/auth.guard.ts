// Angular
import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
// RXJS
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
// NGRX
import {Store, select} from '@ngrx/store';
import * as authActions from '../../auth.actions';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private store: Store<any>) {
  }

  canActivate(): Observable<boolean> {
    return this.store.pipe(
      select((s: any) => s.auth.user),
      map(user => {
        if (!user) {
          this.store.dispatch(new authActions.LoginRedirect({
            urlRedirect: undefined,
            typeAuth: null
          }));
          return false;
        }
        return true;
      }), take(1));
  }

}
