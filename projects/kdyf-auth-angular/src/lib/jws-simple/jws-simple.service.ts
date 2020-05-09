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
import {ProviderType} from '../shared/models/provider.enum';
import {Configuration} from '../shared/models/configuration.model';
import {AuthenticateResponse, AuthenticateByLogin, User} from '../shared/models/auth.models';

const jwtHelper = new JwtHelperService();

@Injectable()
export class JwsSimpleService {

  config: Configuration;

  constructor(private http: HttpClient,
              private store: Store<any>,
              @Inject('authConfig') private configuration: Configuration[]) {

    const index = this.configuration.findIndex((item: Configuration) => item.providerType === ProviderType.JwsSimple);
    this.config = this.configuration[index];

  }

  login(credentials: AuthenticateByLogin): Observable<{ user: User, authenticate: AuthenticateResponse }> {

    return this.http.post(
      `${this.config.authConfig.loginUrl}`,
      {Username: credentials.username, Password: credentials.password}
    ).pipe<{ user: User, authenticate: AuthenticateResponse }>(
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
