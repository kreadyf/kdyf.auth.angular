import {ProviderType} from './provider.enum';
import {AuthConfig} from './auth-config.model';

export interface Configuration {
  providerId: string;
  providerType: ProviderType;
  authConfig: AuthConfig;
}
