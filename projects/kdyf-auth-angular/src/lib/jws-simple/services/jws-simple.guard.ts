// Angular
import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
// RXJS
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
// NGRX
import * as authActions from '../jws-simple.actions';
import {Store, select} from '@ngrx/store';

@Injectable()
export class JwsSimpleGuard implements CanActivate {

  constructor(private store: Store<any>) {
  }

  canActivate(): Observable<boolean> {
    return this.store.pipe(
      select((s: any) => s.auth.user),
      map(user => {
        if (!user) {
          this.store.dispatch(new authActions.LoginRedirect());
          return false;
        }
        return true;
      }), take(1));
  }

}
