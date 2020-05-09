// Angular
import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders, HttpParameterCodec} from '@angular/common/http';
// RXJS
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
// NGRX
import {Store} from '@ngrx/store';
// Modules
import {JwtHelperService} from '@auth0/angular-jwt';
// Others
import {
  User,
  AuthenticateByLogin,
  AuthenticateResponse,
  AuthenticateBySamlToken,
  AuthenticateByRefreshToken
} from '../shared/models/auth.models';
import {GrantType} from '../shared/models/auth.grant-type.enum';
import {Configuration} from '../shared/models/configuration.model';

const jwtHelper = new JwtHelperService();
const FORM_ENCODED_HTTP_HEADERS: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

export class CustomQueryEncoderHelper implements HttpParameterCodec {
  encodeKey(k: string): string {
    return encodeURIComponent(k);
  }

  encodeValue(v: string): string {
    return encodeURIComponent(v);
  }

  decodeKey(k: string): string {
    return decodeURIComponent(k);
  }

  decodeValue(v: string): string {
    return decodeURIComponent(v);
  }
}

@Injectable()
export class EikonService {


  constructor(private http: HttpClient,
              private store: Store<any>,
              @Inject('authConfig') private config: Configuration) {

  }

  initSaml(): void {
    const config = this.config.authConfig;
    document.location.href = `${config.loginHost}${config.samlInitUrl}`;
  }

  login(grantType: GrantType, credentials: AuthenticateByLogin | AuthenticateBySamlToken): Observable<{ user: User, authenticate: AuthenticateResponse }> {
    const config = this.config.authConfig;

    let body = new HttpParams({encoder: new CustomQueryEncoderHelper()})
      .set('client_id', config.clientId)
      .set('client_secret', config.clientSecret);

    if (grantType == GrantType.PASSWORD) {
      let passwordCredentials = <AuthenticateByLogin> credentials;
      body = body.set('grant_type', 'password')
        .set('username', passwordCredentials.username)
        .set('password', passwordCredentials.password)
        .set('acr_values', `tenant:${passwordCredentials.tenant} authtype:${config.authType}`);
    } else if (grantType == GrantType.SAML) {
      let samlCredentials = <AuthenticateBySamlToken> credentials;
      body = body.set('grant_type', 'saml')
        .set('SAMLResponse', samlCredentials.samlToken);

    }

    return this.http.post(`${config.loginHost}/connect/token`, body, {headers: FORM_ENCODED_HTTP_HEADERS})
      .pipe<{ user: User, authenticate: AuthenticateResponse }>(
        map((data: any) => {
          return {user: this.parseToken(data.access_token), authenticate: {authToken: data.access_token, refreshToken: data.refresh_token}};
        })
      );
  }

  refreshToken(refreshToken: AuthenticateByRefreshToken): Observable<{ user: User, authenticate: AuthenticateResponse }> {
    if (!refreshToken || !refreshToken.refreshToken) {
      return Observable.throw({user: null, authenticate: null});
    }

    const config = this.config.authConfig;

    const body = new HttpParams()
      .set('client_id', config.clientId)
      .set('client_secret', config.clientSecret)
      .set('grant_type', 'refresh_token')
      .set('refresh_token', refreshToken.refreshToken);


    return this.http.post(`${config.loginHost}/connect/token`, body, {headers: FORM_ENCODED_HTTP_HEADERS})
      .pipe(
        map((data: any) => {
          return {user: this.parseToken(data.access_token), authenticate: {authToken: data.access_token, refreshToken: data.refresh_token}};
        })
      );
  }

  parseToken(token: string): User {
    const obj = jwtHelper.decodeToken(token);
    return {username: obj.sub, tenant: obj.tenant, displayName: obj.name, roles: obj.role};
  }

}
