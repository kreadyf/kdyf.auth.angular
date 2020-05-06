// Angular
import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
// RXJS
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
// NGRX
import {Store} from '@ngrx/store';
// Modules
import {JwtHelperService} from '@auth0/angular-jwt';
// Others
import {AuthConfig} from '../models/auth-config.model';
import {AuthenticateResponse, AuthenticateByLogin, User} from '../models/auth.models';

const jwtHelper = new JwtHelperService();

@Injectable()
export class AuthService {


  constructor(private http: HttpClient, @Inject('authConfig') private config: AuthConfig, private store: Store<any>) {

  }

  login(credentials: AuthenticateByLogin): Observable<{ user: User, authenticate: AuthenticateResponse }> {

    return this.http.post(`${this.config.loginUrl}`, {Username: credentials.username, Password: credentials.password})
      .pipe<{ user: User, authenticate: AuthenticateResponse }>(
        map((data: any) => {
          return {user: data.username, authenticate: {authToken: data.token, refreshToken: undefined}};
        })
      );

  }

  parseToken(token: string): User {
    const obj = jwtHelper.decodeToken(token);
    return {username: obj.unique_name, email: obj.email, displayName: obj.display_name, roles: obj.roles};
  }

}
