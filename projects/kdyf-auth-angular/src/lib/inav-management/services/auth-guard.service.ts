import {Injectable} from '@angular/core';
import {CanActivate,} from '@angular/router';
import {Store, select} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import * as Auth from '../auth.actions';

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
          this.store.dispatch(new Auth.LoginRedirect({urlRedirect: undefined}));
          return false;
        }
        return true;
      }), take(1));
    ;
  }
}
