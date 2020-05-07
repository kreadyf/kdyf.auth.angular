import {Injectable, Inject} from '@angular/core';
import {AuthConfig} from '../../models/auth-config.model';

@Injectable()
export class EikonConfigService {

  constructor(@Inject('authConfig') private config: AuthConfig) {
  }

  Get(): AuthConfig {
    return this.config;
  }

}
