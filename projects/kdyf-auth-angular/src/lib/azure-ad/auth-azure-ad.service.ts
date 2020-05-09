// Angular
import {Injectable, Inject} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders, HttpParameterCodec} from '@angular/common/http';
// RXJS
import {map, catchError} from 'rxjs/operators';
import {Observable, forkJoin, of, throwError} from 'rxjs';
// NGRX
import {Store} from '@ngrx/store';
// Others
import {
  User,
  AuthenticateResponse,
  AuthenticateByLogin,
  AuthenticateBySamlToken,
  AuthenticateByRefreshToken,
  AuthenticateByAzureAdToken
} from '../shared/models/auth.models';
import {JwtHelperService} from '@auth0/angular-jwt';
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
export class AuthAzureAdService {

  constructor(private http: HttpClient,
              private store: Store<any>,
              @Inject('authConfig') private config: Configuration) {
  }

  initSaml(): void {
    document.location.href = `${this.config.authConfig.loginHost}${this.config.authConfig.samlInitUrl}`;
  }

  initAzureAd(): void {
    document.location.href = `${this.config.authConfig.urlCode}response_type=${this.config.authConfig.response_type}&state=${this.config.authConfig.state}&client_id=${this.config.authConfig.azureAdClientId}&redirect_uri=${this.config.authConfig.azureAdRedirectUri}&scope=${this.config.authConfig.scope}&prompt=select_account`;
  }

  login(grantType: GrantType,
        credentials: AuthenticateByLogin | AuthenticateBySamlToken | AuthenticateByAzureAdToken): Observable<{ user: User, authenticate: AuthenticateResponse }> {

    let body = new HttpParams({encoder: new CustomQueryEncoderHelper()});
    const loginHost = `${this.config.authConfig.loginHost}/connect/token`;

    if (grantType === GrantType.PASSWORD) {
      const passwordCredentials = <AuthenticateByLogin> credentials;
      body = body
        .set('client_id', this.config.authConfig.clientId)
        .set('client_secret', this.config.authConfig.clientSecret)
        .set('grant_type', 'password')
        .set('username', passwordCredentials.username)
        .set('password', passwordCredentials.password)
        .set('acr_values', `tenant:${passwordCredentials.tenant} authtype:${this.config.authConfig.authType}`);
    } else if (grantType === GrantType.SAML) {
      const samlCredentials = <AuthenticateBySamlToken> credentials;
      body = body;
      body = body
        .set('client_id', this.config.authConfig.clientId)
        .set('client_secret', this.config.authConfig.clientSecret)
        .set('grant_type', 'saml')
        .set('SAMLResponse', samlCredentials.samlToken);
    } else if (grantType === GrantType.AZUREAD) {
      const azureAdCredentials = <AuthenticateByAzureAdToken> credentials;
      body = body
        .set('client_id', this.config.authConfig.azureAdClientId)
        .set('client_secret', this.config.authConfig.azureAdClientSecret)
        .set('grant_type', this.config.authConfig.azureAdGrantType)
        .set('redirect_uri', this.config.authConfig.azureAdRedirectUri)
        .set('code', azureAdCredentials.code);
    }

    return this.http.post(
      `${this.config.authConfig.loginHost}${this.config.authConfig.azureAdTenantId}`,
      body,
      {headers: FORM_ENCODED_HTTP_HEADERS}
    ).pipe<{ user: User, authenticate: AuthenticateResponse }>(
      map((data: any) => {
        return {
          user: this.parseToken(data.access_token),
          authenticate: {authToken: data.access_token, refreshToken: data.refresh_token}
        };
      })
    );
  }

  refreshToken(refreshToken: AuthenticateByRefreshToken): Observable<{ user: User, authenticate: AuthenticateResponse }> {
    if (!refreshToken || !refreshToken.refreshToken) {
      return Observable.throw({user: null, authenticate: null});
    }


    const body = new HttpParams()
      .set('client_id', this.config.authConfig.azureAdClientId)
      .set('client_secret', this.config.authConfig.azureAdClientSecret)
      .set('grant_type', 'refresh_token')
      // .set('resource', config.resource)
      .set('refresh_token', refreshToken.refreshToken)
      .set('scope', this.config.authConfig.scope);

    return this.http.post(
      `${this.config.authConfig.loginHost}${this.config.authConfig.azureAdTenantId}`,
      body,
      {headers: FORM_ENCODED_HTTP_HEADERS}
    ).pipe(
      map((data: any) => {
        return {
          user: this.parseToken(data.access_token),
          authenticate: {authToken: data.access_token, refreshToken: data.refresh_token}
        };
      })
    );
  }

  parseToken(token: string): User {
    const obj = jwtHelper.decodeToken(token);
    return {username: obj.unique_name, tenant: obj.tenant, displayName: obj.name};
  }


  /**Fork join for request array*/

  /*checkAndUpdateAuthorization(): Observable<string[]> {
    let authorizationEndpoints = this.config.authorization;
    if (!authorizationEndpoints)
      return of([]);
    return forkJoin(
      [authorizationEndpoints].map(
        authEndpoint => this.http.get(authEndpoint.url).pipe(map(res => res), catchError(err => authEndpoint.required ? throwError(err) : of([])))))
      .pipe(
        map(results => [].concat.apply([], results.filter(res => this.isArrayOfString(res))))
      );
  }*/

  /**only for one request*/
  checkAndUpdateAuthorization(): Observable<string[]> {
    const authorizationEndpoints = this.config.authConfig.authorization;
    if (!authorizationEndpoints) {
      return of([]);
    }
    return this.http.get(authorizationEndpoints.url)
      .pipe(
        map((results: any) => results),
        catchError(err => authorizationEndpoints.required ? throwError(err) : of([]))
      );
  }

  isArrayOfString(value: any): boolean {
    return Array.isArray(value) && value.every(item => typeof item === 'string');
  }

}
