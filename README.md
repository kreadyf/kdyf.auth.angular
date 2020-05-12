# KDYF-AUTH-ANGULAR

## Versions

| Angular| @kreadyf/auth-angular|
| ------|:------:| 
| >=9.0.0 <10.0.0 | v5.x |
| >=8.0.0 <9.0.0  | v5.x |

## Getting started
### Step 1: Install `@kreadyf/auth-angular`:

#### NPM
```shell
npm install --save @kreadyf/auth-angular
```
#### YARN
```shell
yarn add @kreadyf/auth-angular
```
### Step 2: Configuration environment:
You have three options to login, you can use just one or all

```js
import {ProviderType} from '@kreadyf/auth-angular';

export const environment = {
  production: false,
  ...
  kdyfAuth: [
    {
      providerId: 'test1',
      providerType: ProviderType.AzureAd,
      authConfig: {
        loginUrl: 'https://my-server1/api/auth/'
      }
    },
    {
      providerId: 'test2',
      providerType: ProviderType.Eikon,
      authConfig: {
        loginUrl: 'https://my-server2/api/auth/'
      }
    },
    {
      providerId: 'test3',
      providerType: ProviderType.JwsSimple,
      authConfig: {
        loginUrl: 'https://my-server3/api/auth/'
      }
    }
  ]
};
```

### Step 3: Import AuthModule:
```js
import {AuthModule} from '@kreadyf/auth-angular';

@NgModule({
  declarations: [AppComponent],
  imports: [AuthModule.forRoot(environment.kdyfAuth)],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

Basic login example:
```js
import {ProviderType} from '@kreadyf/auth-angular';
import * as authActions from '@kreadyf/auth-angular';
import {AuthActionTypes} from '@kreadyf/auth-angular';

    // Send data to login
    this.store.dispatch(
      new authActions.Login({
        credentials: {username: my-email, password: my-password},
        typeAuth: ProviderType.JwsSimple
    }));

    // Listen success login
    this.actions.pipe(
      filter(s => s.type === AuthActionTypes.AuthenticationSuccess),
      tap(() => ...)
    ).subscribe();

    // Listen failure login
    this.actions.pipe(
      filter(s => s.type === AuthActionTypes.AuthenticationFailure),
      tap(s => ...)
    ).subscribe();

```

## Contributing

Contributions are welcome.

## Inspiration
This component is inspired by KREADYF SRL
