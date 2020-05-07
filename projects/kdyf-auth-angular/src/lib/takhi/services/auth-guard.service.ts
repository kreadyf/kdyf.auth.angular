// Angular
import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
// RXJS
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
// NGRX
import * as Auth from '../auth.actions';
import {Store, select} from '@ngrx/store';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private store: Store<any>) {
  }

  /*
  How can I remove the dependency to ApplicationState?
  If I incect AuthState it compiles, but still the ApplicationState will be injected with the store
  */

  canActivate(): Observable<boolean> {
    return this.store.pipe(
      select((s: any) => s.auth.user),
      map(user => {
        if (!user) {
          this.store.dispatch(new Auth.LoginRedirect());
          return false;
        }
        return true;
      }), take(1));
  }

}
