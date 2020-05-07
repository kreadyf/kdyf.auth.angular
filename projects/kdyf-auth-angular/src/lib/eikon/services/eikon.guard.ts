import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {Store, select} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import * as authActions from '../eikon.actions';
import {EikonConfigService} from './eikon-config.service';

@Injectable()
export class EikonGuard implements CanActivate {
  constructor(private store: Store<any>, private config: EikonConfigService) {
  }

  canActivate(): Observable<boolean> {
    return this.store.pipe(
      select(s => s.auth.user),
      map(user => {
        if (!user) {
          this.store.dispatch(new authActions.LoginRedirect());
          return false;
        }
        return true;
      }), take(1));

  }

}
