// Angular
import {Injectable, Inject} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
// Others
import {OAuth2Config} from '../models/oauth2-config.model';
import {Observable} from 'rxjs';

@Injectable()
export class Oauth2Service {


  constructor(private http: HttpClient,
              @Inject('authConfig') private config: OAuth2Config) {
  }

  initInav(): void {
    const encode = encodeURIComponent(`${this.config.ReturnUrl}client_id=${this.config.client_id}&redirect_uri=${this.config.redirect_url}&response_type=${this.config.response_type}&scope=${this.config.scope}&state=${this.config.state}&nonce=${this.config.nonce}`);
    document.location.href = `${this.config.stsServer}/Account/Login?ReturnUrl=${encode}`;
  }

  getUser(): Observable<HttpResponse<any>> {
    return this.http.get(`${this.config.stsServer}/connect/userinfo`, {observe: 'response'});
  }

}
